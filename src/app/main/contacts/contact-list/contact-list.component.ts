import { Component } from '@angular/core';
import { ContactService } from '../../../services/contact-service.service';
import { IContact } from '../../../interfaces/icontact';
import { IsActiveMatchOptions } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  
  groupedContacts: {letter: string; contacts: IContact[]}[] = [];
  
  contactsFromList: IContact[] = [];  

  constructor(private contactService: ContactService) {
    setTimeout(() => {
      this.groupContacts();
      console.log(this.contactsFromList);
      
    }, 1000);
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
    });
    

  }

  // sortContacts() {
  //   this.contactsFromList.sort((a, b) => a.name.localeCompare(b.name));
  //   console.log(this.contactsFromList); 
  // }

  groupContacts() {
    const sortedContacts = this.contactsFromList.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Erstelle eine Map mit Buchstaben als Schlüssel und Kontaktlisten als Werte
    const groups = sortedContacts.reduce((acc, contact) => {
      const letter = contact.name.charAt(0).toLowerCase(); // Ersten Buchstaben holen
      if (!acc[letter]) {
        acc[letter] = []; // Neue Gruppe erstellen, falls sie noch nicht existiert
      }
      acc[letter].push(contact); // Kontakt zur passenden Gruppe hinzufügen
      return acc;
    }, {} as {[key: string]: IContact[]});

    this.groupedContacts = Object.keys(groups).sort().map(letter => ({
      letter, contacts: groups[letter]
    }));
  }
}
