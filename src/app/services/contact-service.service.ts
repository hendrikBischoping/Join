import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { IContact } from '../interfaces/icontact';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for managing contacts in Firestore.
 */
export class ContactService {
  
  /** Name of the Firestore collection for contacts. */
  private collectionName = 'Contacts'; 

  /**
   * Constructor to initialize the ContactService.
   * @param firebaseService - The service for interacting with Firebase.
   */
  constructor(private firebaseService: FirebaseService) {}

  /**
   * Subscribes to all contact documents from the Firestore database.
   * @returns An Observable with the list of all contacts.
   */
  getContacts() {
    return this.firebaseService.contact$;
  }

  /**
   * Retrieves a single contact based on the ID.
   * @param contactId - The ID of the desired contact.
   * @returns A Promise with the contact data or `null` if not found.
   */
  getContactById(contactId: string) {
    return this.firebaseService.getSingleDoc(this.collectionName, contactId);
  }

  /**
   * Adds a new contact to the Firestore database.
   * @param contact - The contact object to be added.
   */
  async addContact(contact: IContact) {
    await this.firebaseService.addToDB(this.collectionName, contact);
  }

  /**
   * Updates the data of an existing contact.
   * @param contactId - The ID of the contact to be updated.
   * @param updatedData - An object with the data to be updated.
   * @returns A Promise that resolves when the update is successful.
   */
  async updateContact(contactId: string, updatedData: Partial<IContact>) {
    return await this.firebaseService.updateDoc(this.collectionName, contactId, updatedData);
  }

  /**
   * Deletes a contact from the Firestore database.
   * @param contactId - The ID of the contact to be deleted.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async deleteContact(contactId: string) {
    return await this.firebaseService.deleteDocument(this.collectionName, contactId);
  }
}

