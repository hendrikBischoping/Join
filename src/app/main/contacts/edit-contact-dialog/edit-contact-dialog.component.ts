import { ChangeDetectorRef, Component, Inject, Input, SimpleChanges } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../../services/contact-service.service';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss',
})
export class EditContactDialogComponent {

  @Input() contact!: IContact;
  @Input() close!: () => void;;

  editedContact!: IContact;

  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.editedContact = { ...this.contact };
  }

  deleteContact() {
    this.contactService.deleteContact(this.contact.id!);
    this.close();
  }

  async saveContactInfo(ngForm: NgForm) {
    if (!this.editedContact.id) return;

    if (!ngForm.valid) {
      this.cdRef.detectChanges();
      return
    }

    await this.contactService.updateContact(this.editedContact.id, this.editedContact);
    this.close();
  }
}
