import { Component, Inject } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContactService } from '../../../services/contact-service.service';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatInputModule, MatFormFieldModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})
export class EditContactDialogComponent {
  contact: IContact;

  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: IContact }
  ) {
    this.contact = data.contact;
  }

  async deleteContact() {
    this.contactService.deleteContact(this.contact.id!);
  }

  async saveContactInfo() {
    this.dialogRef.close(this.contact);
  }
}
