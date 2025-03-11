import { ChangeDetectorRef, Component, Inject, Input, SimpleChanges } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../../services/contact-service.service';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss',
})
/**
 * Represents a dialog component for editing a contact's information.
 */
export class EditContactDialogComponent {

  @Input() contact!: IContact;
  @Input() close!: () => void;

  editedContact!: IContact;

  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef) {}

  /**
   * Lifecycle Hook: Called when the component is initialized.
   * Initializes 'editedContact' with the values from the 'contact' input.
   */
  ngOnInit(): void {
    this.editedContact = { ...this.contact };
  }

  /**
   * Deletes the current contact and closes the dialog.
   */
  deleteContact() {
    this.contactService.deleteContact(this.contact.id!);
    this.close();
  }

  /**
   * Saves the updated contact information.
   * @param ngForm - The Angular form object that handles validation.
   */
  async saveContactInfo(ngForm: NgForm) {
    if (!this.editedContact.id) { return; }
    if (!ngForm.valid) {
      this.cdRef.detectChanges(); 
      return;
    }
    await this.contactService.updateContact(this.editedContact.id, this.editedContact);
    this.close(); 
  }
}