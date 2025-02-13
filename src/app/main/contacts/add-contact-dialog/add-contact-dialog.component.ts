import { Component } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../../services/contact-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})
export class AddContactDialogComponent {
  contact: IContact = 
    {
      name: '',
      eMail: '',
      phone: 0,
    }

  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<AddContactDialogComponent>
  ) {
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return; 
  
    const newContact: IContact = {
      name: form.value.name,
      eMail: form.value.email,
      phone: form.value.phone
    };
  
    await this.contactService.addContact(newContact).then(() => {
      this.dialogRef.close();
    });
  }


}
