import { Component } from '@angular/core';
import { ContactService } from '../../../services/contact-service.service';
import { IContact } from '../../../interfaces/icontact';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  contactsFromList: IContact[]= [];


  

  constructor(private contactService: ContactService) {
    // this.sortContacts();
  }

<<<<<<< HEAD
  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
      this.sortContacts();
    })
  }
=======
  // ngOnInit() {
  //   this.contactService.getContacts().subscribe((contactList) => {
  //     this.contactsFromList = contactList;
  //   })
  // }
>>>>>>> 1b713c06348356689aca44fa55dc874a33eae8e3

  sortContacts() {
    this.contactsFromList.sort((a, b) => a.name.localeCompare(b.name));
    console.log(this.contactsFromList);
    
  }

}
