import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ContactFloatingComponent } from './contact-floating/contact-floating.component';
import { MatDialog } from '@angular/material/dialog';

import { ContactListComponent } from './contact-list/contact-list.component';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component';
import { IContact } from '../../interfaces/icontact';
import { ContactService } from '../../services/contact-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactFloatingComponent, ContactListComponent, CommonModule],

  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  selectedContactId: string = '';
  slideLeft = false;

  selectContact(id: string) {
    this.selectedContactId = id;
    this.toggleSlideList();
  }

  toggleSlideList() {
    this.slideLeft = !this.slideLeft;
  }
}
