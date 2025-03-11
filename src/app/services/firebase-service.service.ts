import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { IContact } from '../interfaces/icontact';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})

/**
 * Service for interacting with Firestore, managing contacts and tasks.
 */
export class FirebaseService {
  /** Firestore instance */
  firestore: Firestore = inject(Firestore);

  /** Functions to unsubscribe from Firestore subscriptions */
  unsubscribeContacts: () => void;
  unsubscribeTasks: () => void;

  /** Subject for the contact list */
  private contactSubject = new BehaviorSubject<IContact[]>([]);
  /** Observable for the contact list */
  contact$ = this.contactSubject.asObservable();

  /** Subject for the task list */
  private taskSubject = new BehaviorSubject<ITask[]>([]);
  /** Observable for the task list */
  task$ = this.taskSubject.asObservable();

  /** Categories for tasks */
  todo: ITask[] = [];
  inProgress: ITask[] = [];
  awaitFeedback: ITask[] = [];
  done: ITask[] = [];

  constructor() {
    this.unsubscribeContacts = this.subContactList();
    this.unsubscribeTasks = this.subTaskList();
  }

  /**
   * Subscribes to the contact list from Firestore and updates the observable.
   * @returns A function to unsubscribe from the snapshot.
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
   * Subscribes to the task list from Firestore and updates the observable.
   * @returns A function to unsubscribe from the snapshot.
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
   * Categorizes a task based on its status.
   * @param task - The task to categorize.
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
   * Updates the status of a task in the database.
   * @param taskId - The ID of the task.
   * @param newStatus - The new status of the task.
   */
  async updateTaskStatus(taskId: string, newStatus: string) {
    const taskDocRef = doc(this.firestore, `Tasks/${taskId}`);
    await updateDoc(taskDocRef, { status: newStatus })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Creates an IContact object from Firestore data.
   * @param obj - The received object from Firestore.
   * @param id - The ID of the contact.
   * @returns An IContact object.
   */
  setContactData(obj: any, id: string): IContact {
    const capitalizedName = obj.name ? this.capitalizeName(obj.name) : "";
    const nameInitials = this.getInitials(capitalizedName);
    const initialsBgSelector = this.getBgSelector(capitalizedName);

    return {
      name: capitalizedName,
      eMail: obj.eMail || "",
      phone: obj.phone || 111,
      initials: nameInitials || "",
      styleSelector: initialsBgSelector || "",
      id: id || "",
    };
  }

  /**
   * Creates an ITask object from Firestore data.
   * @param obj - The received object from Firestore.
   * @param id - The ID of the task.
   * @returns An ITask object.
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
   * Capitalizes a name (e.g., "max mustermann" -> "Max Mustermann").
   * @param name - The name as a string.
   * @returns The capitalized name.
   */
  capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Extracts the initials from a name.
   * @param name - The full name.
   * @returns The initials of the name.
   */
  getInitials(name: string): string {
    if (!name) return "";
    return name.trim().split(/\s+/).map(word => word[0].toUpperCase()).join("");
  }

  /**
   * Determines the background selector based on the third letter of a name.
   * @param name - The name.
   * @returns A selector for the background style.
   */
  getBgSelector(name: string): string {
    if (!name) return "";
    return name.length > 2 ? name[2].toLocaleLowerCase() : 'default';
  }

  /**
   * Gets a reference to a Firestore collection.
   * @param colId - The ID of the collection.
   * @returns The CollectionReference.
   */
  getColRef(colId: string) {
    return collection(this.firestore, colId);
  }

  /**
   * Gets a reference to a Firestore document.
   * @param colId - The ID of the collection.
   * @param docId - The ID of the document.
   * @returns The DocumentReference.
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(this.getColRef(colId), docId);
  }

  /**
   * Retrieves a single document from Firestore.
   * @param colId - The ID of the collection.
   * @param docId - The ID of the document.
   * @returns A Promise with the document or `null` if it does not exist.
   */
  async getSingleDoc(colId: string, docId: string): Promise<IContact | ITask | null> {
    const docSnap = await getDoc(this.getSingleDocRef(colId, docId));
    return docSnap.exists() ? (docSnap.data() as IContact | ITask) : null;
  }

  /**
   * Adds a new document to the Firestore database.
   * @param colId - The ID of the collection.
   * @param item - The object to be added.
   */
  async addToDB(colId: string, item: ITask | IContact): Promise<void> {
    try {
      await addDoc(this.getColRef(colId), item);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }

  /**
   * Updates a document in Firestore.
   * @param colId - The ID of the collection.
   * @param docId - The ID of the document.
   * @param updatedData - The data to be updated.
   */
  async updateDoc(colId: string, docId: string, updatedData: Partial<IContact | ITask>): Promise<void> {
    try {
      await updateDoc(this.getSingleDocRef(colId, docId), updatedData);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  /**
   * Deletes a document from Firestore.
   * @param colId - The ID of the collection.
   * @param docId - The ID of the document.
   */
  async deleteDocument(colId: string, docId: string): Promise<void> {
    try {
      await deleteDoc(this.getSingleDocRef(colId, docId));
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy() {
    this.unsubscribeContacts?.();
    this.unsubscribeTasks?.();
  }
}
