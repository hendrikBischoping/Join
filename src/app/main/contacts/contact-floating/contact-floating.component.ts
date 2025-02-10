import { Component } from '@angular/core';
import { IContact } from '../../../interfaces/icontact';
import { ContactService } from '../../../services/contact-service.service';


@Component({
  selector: 'app-contact-floating',
  standalone: true,
  imports: [],
  templateUrl: './contact-floating.component.html',
  styleUrl: './contact-floating.component.scss'
})
export class ContactFloatingComponent {
 contactsFromList: IContact[]= [
    {
      name: "Hendrik Bischoping",
      eMail: "hbischoping@googlemail.com",
      phone: 31245,
    },
  ];

  constructor(private contactService: ContactService) {
    
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contactsFromList = contactList;
    })
  }





}
