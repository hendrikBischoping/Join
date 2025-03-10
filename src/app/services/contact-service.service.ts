import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { IContact } from '../interfaces/icontact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  /** Name der Firestore-Sammlung für Kontakte */
  private collectionName = 'Contacts'; 

  constructor(private firebaseService: FirebaseService) {}

  /**
   * Abonniert alle Kontakt-Dokumente aus der Firestore-Datenbank.
   * @returns Ein Observable mit der Liste aller Kontakte.
   */
  getContacts() {
    return this.firebaseService.contact$;
  }

  /**
   * Ruft einen einzelnen Kontakt basierend auf der ID ab.
   * @param contactId - Die ID des gewünschten Kontakts.
   * @returns Ein Promise mit den Kontaktdaten oder `null`, falls nicht vorhanden.
   */
  getContactById(contactId: string) {
    return this.firebaseService.getSingleDoc(this.collectionName, contactId);
  }

  /**
   * Fügt einen neuen Kontakt zur Firestore-Datenbank hinzu.
   * @param contact - Das Kontakt-Objekt, das hinzugefügt werden soll.
   */
  async addContact(contact: IContact) {
    await this.firebaseService.addToDB(this.collectionName, contact);
  }

  /**
   * Aktualisiert die Daten eines vorhandenen Kontakts.
   * @param contactId - Die ID des zu aktualisierenden Kontakts.
   * @param updatedData - Ein Objekt mit den zu aktualisierenden Daten.
   * @returns Ein Promise, das auf die erfolgreiche Aktualisierung wartet.
   */
  async updateContact(contactId: string, updatedData: Partial<IContact>) {
    return await this.firebaseService.updateDoc(this.collectionName, contactId, updatedData);
  }

  /**
   * Löscht einen Kontakt aus der Firestore-Datenbank.
   * @param contactId - Die ID des zu löschenden Kontakts.
   * @returns Ein Promise, das auf den Abschluss der Löschung wartet.
   */
  async deleteContact(contactId: string) {
    return await this.firebaseService.deleteDocument(this.collectionName, contactId);
  }
}

