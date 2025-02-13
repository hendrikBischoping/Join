import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ContactService } from '../../../services/contact-service.service';
import { IContact } from '../../../interfaces/icontact';
import { MatDialog } from '@angular/material/dialog';
import { IsActiveMatchOptions } from '@angular/router';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';

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
  readonly dialog = inject(MatDialog);

  constructor(private contactService: ContactService, private cdRef: ChangeDetectorRef) {
    setTimeout(() => {
      this.groupContacts();
      // console.log(this.contactsFromList);
    }, 1000);
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
    });
    

  }

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

  addContact() {
    
    const dialog = this.dialog.open(AddContactDialogComponent, {
      panelClass: 'custom-dialog-container', 
      width: '80%', 
      position: { right: '10vw' }
    });
  
    dialog.beforeClosed().subscribe(() => {
      document.querySelector('.mat-dialog-container')?.classList.add('custom-dialog-container-exit');
    });
  }

  openSingleContakt(contact: IContact){
    console.log(contact.id);
    if (!contact.isOpened) {
      console.log('closed');
      contact.isOpened = true;
    } else {console.log('open');
      contact.isOpened = false;}
  }
}
