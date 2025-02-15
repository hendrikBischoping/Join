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
  selectedContactId: string = '';

  selectContact(id: string) {
    this.selectedContactId = id;
  }

}
