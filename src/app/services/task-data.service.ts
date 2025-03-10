import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  /** Name der Firestore-Sammlung für Tasks */
  private collectionName = 'Tasks'; 
  
  /**
   * Erstellt eine Instanz des TaskDataService.
   * @param firebaseService - Der Firebase-Service für Datenbankoperationen
   */
  constructor(private firebaseService: FirebaseService) {}

  /**
   * Abonniert alle Task-Dokumente aus der Datenbank.
   * @returns Ein Observable mit der Task-Liste
   */
  getTasks() {
    return this.firebaseService.task$;
  }

  /**
   * Ruft ein einzelnes Task-Dokument anhand der ID ab.
   * @param taskId - Die ID des gewünschten Tasks
   * @returns Ein Promise mit dem Task-Dokument
   */
  getTaskById(taskId: string) {
    return this.firebaseService.getSingleDoc(this.collectionName, taskId);
  }

  /**
   * Fügt einen neuen Task zur Datenbank hinzu.
   * @param task - Das Task-Objekt, das hinzugefügt werden soll
   * @returns Ein Promise, das die Fertigstellung der Operation signalisiert
   */
  async addTask(task: ITask): Promise<void> {
    console.log(task);
    await this.firebaseService.addToDB(this.collectionName, task);
  }

  /**
   * Aktualisiert einen bestehenden Task in der Datenbank.
   * @param taskId - Die ID des Tasks, der aktualisiert werden soll
   * @param updatedData - Die neuen Daten für den Task
   * @returns Ein Promise mit dem aktualisierten Dokument
   */
  async updateTask(taskId: string, updatedData: Partial<ITask>) {
    return await this.firebaseService.updateDoc(this.collectionName, taskId, updatedData);
  }

  /**
   * Löscht einen Task aus der Datenbank.
   * @param taskId - Die ID des zu löschenden Tasks
   * @returns Ein Promise, das die Fertigstellung der Löschung signalisiert
   */
  async deleteTask(taskId: string) {
    return await this.firebaseService.deleteDocument(this.collectionName, taskId);
  }
}

