import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service'; // Stelle sicher, dass der Pfad korrekt ist
import { IContact } from '../interfaces/icontact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  private collectionName = 'Contacts'; // Nur für Kontakte

  constructor(private firebaseService: FirebaseService) {}

  // Alle Kontakt-Dokumente abonnieren
  getContacts() {
    return this.firebaseService.contact$;
  }

  // Einzelnen Kontakt abrufen
  getContactById(contactId: string) {
    return this.firebaseService.getSingleDoc(this.collectionName, contactId);
  }

  // Kontakt hinzufügen
  async addContact(contact: IContact) {
    return await this.firebaseService.addToDB(this.collectionName, contact);
  }

  // Kontakt aktualisieren
  async updateContact(contactId: string, updatedData: Partial<IContact>) {
    return await this.firebaseService.updateDoc(this.collectionName, contactId, updatedData);
  }

  // Kontakt löschen
  async deleteContact(contactId: string) {
    return await this.firebaseService.deleteDocument(this.collectionName, contactId);
  }
}
