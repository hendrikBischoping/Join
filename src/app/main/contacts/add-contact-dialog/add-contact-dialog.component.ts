import { Component, Inject } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../../services/contact-service.service';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})
export class AddContactDialogComponent {
  contact: IContact;

  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: IContact }
  ) {
    this.contact = data.contact;
  }

  async addContact() {
    this.contactService.addContact(this.contact);
  }


}
