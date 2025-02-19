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
    getTaskById(contactId: string) {
      return this.firebaseService.getSingleDoc(this.collectionName, contactId);
    }
  
    // Tasks hinzufügen
    async addTask(contact: ITask) {
      await this.firebaseService.addToDB(this.collectionName, contact);
    }
  
    // Tasks aktualisieren
    async updateTask(contactId: string, updatedData: Partial<ITask>) {
      return await this.firebaseService.updateDoc(this.collectionName, contactId, updatedData);
    }
  
    // Tasks löschen
    async deleteTask(contactId: string) {
      return await this.firebaseService.deleteDocument(this.collectionName, contactId);
    }
}
