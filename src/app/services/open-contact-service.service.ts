import { Injectable } from '@angular/core';
import { IContact } from '../interfaces/icontact';

@Injectable({
  providedIn: 'root'
})
export class OpenContactServiceService {
  openedContact: IContact[] = [];

  constructor() { }

  openSingleContact(contactData: IContact){
    this.openedContact = [];
    this.openedContact.push(contactData);
  }
}
