import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../../services/contact-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [FormsModule,  MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})

/**
 * Represents a dialog component for adding a contact.
 */
export class AddContactDialogComponent {
  contact: IContact = {
    name: '',
    eMail: '',
    phone: '',
  };

  sendForm = false;
  @Input() close!: () => void;

  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef) {}

  /**
   * Handles the submission of the form to add a contact.
   * @param form The form containing the contact data.
   */
  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.cdRef.detectChanges();
      return;
    }
    
    this.sendForm = true;
    this.cdRef.detectChanges();

    const newContact: IContact = {
      name: form.value.name,
      eMail: form.value.email,
      phone: form.value.phone
    };
    
    await this.contactService.addContact(newContact).then(() => {
      setTimeout(() => {
        this.sendForm = false;
        this.close();
      }, 2000);
    });
  }
}