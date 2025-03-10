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
export class EditContactDialogComponent {

  @Input() contact!: IContact;
  @Input() close!: () => void;;

  editedContact!: IContact;

  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef) {}

  /**
   * Lifecycle Hook: Wird bei der Initialisierung des Komponenten aufgerufen.
   * Initialisiert 'editedContact' mit den Werten des 'contact'-Inputs.
   */
  ngOnInit(): void {
    this.editedContact = { ...this.contact };
  }

  /**
   * Löscht den aktuellen Kontakt und schließt den Dialog.
   */
  deleteContact() {
    this.contactService.deleteContact(this.contact.id!);
    this.close();
  }

  /**
   * Speichert die aktualisierten Kontaktdaten.
   * @param ngForm - Das Angular-Formularobjekt, das die Validierung übernimmt.
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
