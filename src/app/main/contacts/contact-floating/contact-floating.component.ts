import { ChangeDetectorRef, Component, inject, Input, input } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { ContactService } from '../../../services/contact-service.service';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-floating',
  standalone: true,
  imports: [],
  templateUrl: './contact-floating.component.html',
  styleUrl: './contact-floating.component.scss',
})
export class ContactFloatingComponent {
  // openContact = inject(OpenContactServiceService);
  @Input() watchTarget: string = "";
  contactsFromList: IContact[] = [
    {
      name: 'Hendrik Bischoping',
      eMail: 'hbischoping@googlemail.com',
      phone: 31245,
    },
  ];
  readonly dialog = inject(MatDialog);

  constructor(
    private contactService: ContactService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
    });
  }

  editData(contactId?: string) {
    const selectedContact = this.contactsFromList.find(
      (contact) => contact.id === contactId
    );
    if (!selectedContact) {
      console.error('Contact not found!');
      return;
    }

    const dialog = this.dialog.open(EditContactDialogComponent, {
      data: { contact: { ...selectedContact } }, 
      panelClass: 'custom-dialog-container', 
      width: '80%', 
      position: { right: '10vw' }
    });

    dialog.beforeClosed().subscribe(() => {
      document.querySelector('.mat-dialog-container')?.classList.add('custom-dialog-container-exit');
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.contactService.updateContact(contactId!, result);
        this.cdRef.detectChanges();
      }
    });
  }
  deleteData(contactId?: string) {
    this.contactService.deleteContact(contactId!);
  }
}
