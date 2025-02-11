import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';
import { MatDialog } from '@angular/material/dialog';

import { ContactListComponent } from './contact-list/contact-list.component';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';
import { IContact } from '../../interfaces/icontact';
import { ContactService } from '../../services/contact-service.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactFloatingComponent, ContactListComponent],

  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  contactData: IContact[] = [{
    name: "",
    eMail: "",
    phone: 0,
  }];
  readonly dialog = inject(MatDialog);

  constructor(private contactDatabase: ContactService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.contactDatabase.getContacts().subscribe((contactList) => {
      this.contactData = contactList;
    });
  }

  editData(contactId?: string) {

    const selectedContact = this.contactData.find(contact => contact.id === contactId);
    if (!selectedContact) {
      console.error("Contact not found!");
      return;
    }

    const dialog = this.dialog.open(EditContactDialogComponent, {
      data: { contact: { ...selectedContact } } // Kopie des Objekts übergeben
    });
    

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.contactDatabase.updateContact(contactId!, result); 
        this.cdRef.detectChanges(); 
      }
    });
  }


}
