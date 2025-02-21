import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  private collectionName = 'Tasks'; 
  
    constructor(private firebaseService: FirebaseService) {}
  
    // Alle Tasks-Dokumente abonnieren
    getTasks() {
      return this.firebaseService.task$;
    }
    
  
    // Einzelnen Tasks abrufen
    getTaskById(taskId: string) {
      return this.firebaseService.getSingleDoc(this.collectionName, taskId);
    }
  
    // Tasks hinzufügen
    async addTask(task: ITask) {
      await this.firebaseService.addToDB(this.collectionName, task);
    }
  
    // Tasks aktualisieren
    async updateTask(taskId: string, updatedData: Partial<ITask>) {
      return await this.firebaseService.updateDoc(this.collectionName, taskId, updatedData);
    }
  
    // Tasks löschen
    async deleteTask(taskId: string) {
      return await this.firebaseService.deleteDocument(this.collectionName, taskId);
    }
}
