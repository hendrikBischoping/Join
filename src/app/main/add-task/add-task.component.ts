import { isDataSource } from '@angular/cdk/collections';
import { Component, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ITask } from '../../interfaces/itask'; 
import { TaskDataService } from '../../services/task-data.service';
import { IContact } from '../../interfaces/icontact';

import { ContactService } from '../../services/contact-service.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  @Input() currentTaskId = "";
  
  placeholderListContacts = [
    {
      name: 'Andreas',
      initials: 'AW',
    },
    {
      name: 'Sascha',
      initials: 'ST',
    },
    {
      name: 'Hendrik',
      initials: 'HB',
    },
  ];

  taskCategories: { category: string }[] = [
    { category: 'Technical Task' },
    { category: 'User Story' }
  ];

  saveDateTestArray: string[] = [];

  prioUrgent = false;
  prioMedium = true;
  prioLow = false;

  task: ITask =
  {
    title: 'Testtitel',
    description: 'Test 2',
    contacts: [""],
    date: '10.10.2020',
    priority: 'Medium',
    category: 'User Story',
    subtasks: [
      {subtaskName: 'Board fertigstellen', subtaskDone: false},
      {subtaskName: 'Add-Task fertigstellen', subtaskDone: true}
    ],
    status: 'todo',
    id: '',
  };
  contacts!: IContact[];
  contactsFromList: IContact[] = [];  
  sortedContacts: IContact[] = [];  
  previewTask: ITask = {
    title: "",
    description: "",
    contacts: [],
    date: '0',
    priority: "mid",
    category: "",
    subtasks: [],
    status: "",
    id: ""
  };
  filteredContacts: IContact[] = [];
  dropdownOpen = false;
  searchTerm: string = "";
  taskAdded = false;
  isUserStory = false;
  constructor(private contactService: ContactService, private cdRef: ChangeDetectorRef, private taskDataService: TaskDataService,) {};

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contacts = contactList;
      this.filteredContacts = [...this.contacts];
      this.cdRef.detectChanges();
    });
    this.taskDataService.getTasks().subscribe((taskList) => {
      taskList.forEach(element => {
        if (this.currentTaskId == element.id) {
          this.task = element;
          this.previewTask = JSON.parse(JSON.stringify(this.task));
        }
      });
    });
    this.initTask();

  }

  filterContacts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query)
    );
    this.cdRef.detectChanges();
  }  
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isClickInsideDropdown(event)) {
      this.closeDropdown();
    }
  }
  closeDropdown() {
    this.dropdownOpen = false;
    this.cdRef.detectChanges();
  }

  isClickInsideDropdown(event: Event): boolean {
    const dropdownContainer = document.querySelector(".assignment-container");
    return dropdownContainer?.contains(event.target as Node) ?? false;
  }
  
  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges();
  }

  initTask() {
    if (this.task.category == "User Story") {
      this.isUserStory = true;
    }
  }

  toggleContactAssignment(contactId: string) {
    const index = this.previewTask.contacts!.indexOf(contactId);
    if (index === -1) {
      this.previewTask.contacts!.push(contactId);
    } else {
      this.previewTask.contacts!.splice(index, 1);
    }
  }

  getPrioImagePath(prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else
      return this.previewTask.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
  }

  changePriority(prio: string) {
    this.previewTask.priority = prio;
  }

  isPriorityActive(prio: string): boolean {
    return this.previewTask.priority === prio;
  }

  getDate() {
    let dateData: string = this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : '';      
    return dateData;
  }

  async submitTask(form: NgForm) {
      if (form.valid && form.submitted) {
        this.getDate();
     }
    this.taskAdded = true;
  
  this.task.contacts!.push('8W3sjYScAi0V0h38A6Hj');
  this.task.contacts!.push('8e1QzZ3rKZod5ovZ2Tpi');
  this.task.subtasks = [
    {subtaskName: 'Board fertigstellen', subtaskDone: false},
    {subtaskName: 'Add-Task fertigstellen', subtaskDone: true}
  ];
  
  await this.taskDataService.addTask(this.task).then(() => {
    console.log("abruf", this.task.contacts);
    
    this.taskAdded = false;
    form.resetForm();
  })
  
}
}
