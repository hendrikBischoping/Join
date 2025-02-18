import { Component, Inject, Input, SimpleChanges } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
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

  constructor(private contactService: ContactService) {
    console.log(this.contact);
    
  }

  ngOnInit(): void {
    console.log('ngOnInit contact:', this.contact);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact']) {
      console.log('ngOnChanges contact:', changes['contact'].currentValue);
    }
  }

  deleteContact() {
    this.contactService.deleteContact(this.contact.id!);
    this.close();
  }

  saveContactInfo():void {
    this.close();
  }
}
