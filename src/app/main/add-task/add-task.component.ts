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

  taskCategories: { category: string }[] = [
    { category: 'Technical Task' },
    { category: 'User Story' }
  ];

  saveDateTestArray: string[] = [];
  editingSubtasks = new Map<string, boolean>();
  task: ITask =
  {
    title: '',
    description: '',
    contacts: [""],
    date: '10.10.2020',
    priority: 'Medium',
    category: 'User Story',
    subtasks: [],
    status: 'todo',
    id: '',
  };
  contacts!: IContact[];
  contactsFromList: IContact[] = [];  
  sortedContacts: IContact[] = [];  
  newSubtaskName: string = '';
  filteredContacts: IContact[] = [];
  dropdownOpen = false;
  searchTerm: string = "";
  taskAdded = false;
  isUserStory = false;
  subtaskTerm: string = "";
  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef, private taskDataService: TaskDataService,) {};

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contacts = contactList;
      this.filteredContacts = [...this.contacts];
      this.cdRef.detectChanges();
    });

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
    const index = this.task.contacts!.indexOf(contactId);
    if (index === -1) {
      this.task.contacts!.push(contactId);
    } else {
      this.task.contacts!.splice(index, 1);
    }
  }

  getPrioImagePath(prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else
      return this.task.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
  }

  changePriority(prio: string) {
    this.task.priority = prio;       
  }

  isPriorityActive(prio: string): boolean {
    return this.task.priority === prio;
  }

  getDate() {
    let dateData: string = this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : '';      
    return dateData;
  }

  addSubtask() {
    if (this.newSubtaskName == "") {
      return;
    }
    this.task.subtasks?.push({ subtaskName: this.newSubtaskName, subtaskDone: false });
    this.newSubtaskName = "";
    return
  }

  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, true);
  }

  saveSubtaskEdit(oldName: string, newName: string) {
    const subtask = this.task.subtasks?.find(s => s.subtaskName === oldName);
    if (subtask) {
      subtask.subtaskName = newName;
    }
    this.editingSubtasks.delete(oldName); // Bearbeitungsstatus zurücksetzen
    this.cdRef.detectChanges(); // Falls das UI nicht automatisch aktualisiert wird
  }

  cancelSubtaskEdit(subtaskName: string) {
    this.editingSubtasks.delete(subtaskName);
  }

  deleteSubTask(name: string) {
    this.task.subtasks = this.task.subtasks?.filter(subtask => subtask.subtaskName != name);
    this.cdRef.detectChanges();
  }

  clearSubtask() {
    this.newSubtaskName = "";
  }

  clearForm() {
    location.reload();
  }

  async submitTask(form: NgForm) {
      if (form.valid && form.submitted) {
        this.getDate();
     }
    this.taskAdded = true;
  
  await this.taskDataService.addTask(this.task).then(() => {
    console.log("abruf", this.task.contacts);
    
    this.taskAdded = false;
    form.resetForm();
  })
  
}
}
