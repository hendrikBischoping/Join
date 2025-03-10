import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { IContact } from '../interfaces/icontact';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  /** Firestore-Instanz */
  firestore: Firestore = inject(Firestore);

  /** Funktionen zum Abbestellen der Firestore-Abonnements */
  unsubscribeContacts: () => void;
  unsubscribeTasks: () => void;

  /** Subject für die Kontaktliste */
  private contactSubject = new BehaviorSubject<IContact[]>([]);
  /** Observable für die Kontaktliste */
  contact$ = this.contactSubject.asObservable();

  /** Subject für die Task-Liste */
  private taskSubject = new BehaviorSubject<ITask[]>([]);
  /** Observable für die Task-Liste */
  task$ = this.taskSubject.asObservable();

  /** Kategorien für Tasks */
  todo: ITask[] = [];
  inProgress: ITask[] = [];
  awaitFeedback: ITask[] = [];
  done: ITask[] = [];

  constructor() {
    this.unsubscribeContacts = this.subContactList();
    this.unsubscribeTasks = this.subTaskList();
  }

  /**
   * Abonniert die Kontaktliste aus Firestore und aktualisiert das Observable.
   * @returns Eine Funktion zum Abbestellen des Snapshots.
   */
  subContactList() {
    return onSnapshot(this.getColRef("Contacts"), (snapshot) => {
      const updatedContacts: IContact[] = [];
      snapshot.forEach((doc) => {
        updatedContacts.push(this.setContactData(doc.data(), doc.id));
      });
      this.contactSubject.next(updatedContacts);
    });
  }

  /**
   * Abonniert die Task-Liste aus Firestore und aktualisiert das Observable.
   * @returns Eine Funktion zum Abbestellen des Snapshots.
   */
  subTaskList() {
    return onSnapshot(this.getColRef("Tasks"), (snapshot) => {
      this.todo = [];
      this.inProgress = [];
      this.awaitFeedback = [];
      this.done = [];

      const updatedTasks: ITask[] = [];
      snapshot.forEach((doc) => {
        const task = this.setTaskData(doc.data() as ITask, doc.id);
        updatedTasks.push(task);
        this.categorizeTask(task);
      });
      this.taskSubject.next(updatedTasks);
    });
  }

  /**
   * Kategorisiert einen Task basierend auf seinem Status.
   * @param task - Der zu kategorisierende Task
   */
  categorizeTask(task: ITask) {
    if (task.status === 'todo') {
      this.todo.push(task);
    } else if (task.status === 'inProgress') {
      this.inProgress.push(task);
    } else if (task.status === 'awaitFeedback') {
      this.awaitFeedback.push(task);
    } else if (task.status === 'done') {
      this.done.push(task);
    }
  }

  /**
   * Aktualisiert den Status eines Tasks in der Datenbank.
   * @param taskId - Die ID des Tasks
   * @param newStatus - Der neue Status des Tasks
   */
  async updateTaskStatus(taskId: string, newStatus: string) {
    const taskDocRef = doc(this.firestore, `Tasks/${taskId}`);
    await updateDoc(taskDocRef, { status: newStatus })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Erstellt ein IContact-Objekt aus Firestore-Daten.
   * @param obj - Das empfangene Objekt aus Firestore
   * @param id - Die ID des Kontakts
   * @returns Ein IContact-Objekt
   */
  setContactData(obj: any, id: string): IContact {
    const capitalizedName = obj.name ? this.capitalizeName(obj.name) : "";
    const nameInitials = this.getInitials(capitalizedName);
    const initialsBgSelektor = this.getBgSelector(capitalizedName);

    return {
      name: capitalizedName,
      eMail: obj.eMail || "",
      phone: obj.phone || 111,
      initials: nameInitials || "",
      styleSelector: initialsBgSelektor || "",
      id: id || "",
    };
  }

  /**
   * Erstellt ein ITask-Objekt aus Firestore-Daten.
   * @param obj - Das empfangene Objekt aus Firestore
   * @param id - Die ID des Tasks
   * @returns Ein ITask-Objekt
   */
  setTaskData(obj: ITask, id: string): ITask {
    return {
      title: obj.title || "Unknown title",
      description: obj.description || "",
      contacts: obj.contacts || [],
      date: obj.date || '0',
      priority: obj.priority || "mid",
      category: obj.category || "",
      subtasks: obj.subtasks || [],
      status: obj.status || "todo",
      id: id || "",
    };
  }

  /**
   * Kapitalisiert einen Namen (z. B. "max mustermann" -> "Max Mustermann").
   * @param name - Der Name als String
   * @returns Der kapitalisierte Name
   */
  capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Extrahiert die Initialen eines Namens.
   * @param name - Der vollständige Name
   * @returns Die Initialen des Namens
   */
  getInitials(name: string): string {
    if (!name) return "";
    return name.trim().split(/\s+/).map(word => word[0].toUpperCase()).join("");
  }

  /**
   * Bestimmt den Hintergrund-Selektor basierend auf dem dritten Buchstaben eines Namens.
   * @param name - Der Name
   * @returns Ein Selektor für den Hintergrundstil
   */
  getBgSelector(name: string): string {
    if (!name) return "";
    return name.length > 2 ? name[2].toLocaleLowerCase() : 'default';
  }

  /**
   * Ruft eine Referenz auf eine Firestore-Sammlung ab.
   * @param colId - Die ID der Sammlung
   * @returns Die CollectionReference
   */
  getColRef(colId: string) {
    return collection(this.firestore, colId);
  }

  /**
   * Ruft eine Referenz auf ein Firestore-Dokument ab.
   * @param colId - Die ID der Sammlung
   * @param docId - Die ID des Dokuments
   * @returns Die DocumentReference
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(this.getColRef(colId), docId);
  }

  /**
   * Ruft ein einzelnes Dokument aus Firestore ab.
   * @param colId - Die ID der Sammlung
   * @param docId - Die ID des Dokuments
   * @returns Ein Promise mit dem Dokument oder `null`, falls es nicht existiert
   */
  async getSingleDoc(colId: string, docId: string): Promise<IContact | ITask | null> {
    const docSnap = await getDoc(this.getSingleDocRef(colId, docId));
    return docSnap.exists() ? (docSnap.data() as IContact | ITask) : null;
  }

  /**
   * Fügt ein neues Dokument zur Firestore-Datenbank hinzu.
   * @param colId - Die ID der Sammlung
   * @param item - Das hinzuzufügende Objekt
   */
  async addToDB(colId: string, item: ITask | IContact): Promise<void> {
    try {
      await addDoc(this.getColRef(colId), item);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }

  /**
   * Aktualisiert ein Dokument in Firestore.
   * @param colId - Die ID der Sammlung
   * @param docId - Die ID des Dokuments
   * @param updatedData - Die zu aktualisierenden Daten
   */
  async updateDoc(colId: string, docId: string, updatedData: Partial<IContact | ITask>): Promise<void> {
    try {
      await updateDoc(this.getSingleDocRef(colId, docId), updatedData);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  /**
   * Löscht ein Dokument aus Firestore.
   * @param colId - Die ID der Sammlung
   * @param docId - Die ID des Dokuments
   */
  async deleteDocument(colId: string, docId: string): Promise<void> {
    try {
      await deleteDoc(this.getSingleDocRef(colId, docId));
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  }

  /**
   * Entfernt Abonnements, wenn die Komponente zerstört wird.
   */
  ngOnDestroy() {
    this.unsubscribeContacts?.();
  }
}

