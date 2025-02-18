import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { ContactService } from '../../../services/contact-service.service';
import { IContact } from '../../../interfaces/icontact';
import { MatDialog } from '@angular/material/dialog';
import { IsActiveMatchOptions } from '@angular/router';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { OverlayService } from '../../../services/overlay.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  // openContact = inject(OpenContactServiceService);
  @Output() contactSelected = new EventEmitter<string>()
  groupedContacts: {letter: string; contacts: IContact[]}[] = [];
  
  contactsFromList: IContact[] = [];  
  readonly dialog = inject(MatDialog);

  constructor(private contactService: ContactService, private cdRef: ChangeDetectorRef, private overlayService: OverlayService) {
    setTimeout(() => {
      this.groupContacts();
    }, 1000);
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
      this.groupContacts();
      this.cdRef.detectChanges();
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

  // addContact() {
    
  //   const dialog = this.dialog.open(AddContactDialogComponent, {
  //     panelClass: 'custom-dialog-container', 
  //     width: '80%', 
  //     position: { right: '10vw' }
  //   });
  
  //   // Schließen-Animation nach Beenden hinzufügen
  //   dialog.beforeClosed().subscribe(() => {
  //     document.querySelector('.mat-dialog-container')?.classList.add('custom-dialog-container-exit');
  //   });
  // }

  addContact() {
    // this.overlayService.openOverlay(AddContactDialogComponent, {
    //   close: () => this.overlayService.closeOverlay()
    // });
    this.overlayService.openAddContactOverlay();
  }

  selectContact(contactId: string) {
    this.contactSelected.emit(contactId);
  }
}
