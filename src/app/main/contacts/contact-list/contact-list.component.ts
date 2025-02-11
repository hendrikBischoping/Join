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
  contactsFromList: IContact[]= [
    {
      name: "Hendrik Bischoping",
      eMail: "hbischoping@googlemail.com",
      phone: 31245,
    },
  ];


  

  constructor(private contactService: ContactService) {
    this.sortContacts();
  }

  // ngOnInit() {
  //   this.contactService.getContacts().subscribe((contactList) => {
  //     this.contactsFromList = contactList;
  //   })
  // }

  sortContacts() {
    this.contactsFromList.sort((a, b) => a.name.localeCompare(b.name));
    console.log(this.contactsFromList);
    
  }

}
