import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';
import { IContact } from '../../../interfaces/icontact';
import { TaskDataService } from '../../../services/task-data.service';
import { ContactService } from '../../../services/contact-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-detailed-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './detailed-dialog.component.html',
  styleUrl: './detailed-dialog.component.scss'
})
export class DetailedDialogComponent {
  @Input() currentTaskId = "";
  @Input() close!: () => void;

  task: ITask = {
    title: "Unknown",
    description: "No task found",
    contacts: [],
    date: 0,
    priority: "mid",
    category: "Userstory",
    subtasks: [{
      subtaskName: "",
      subtaskDone: false,
    }],
    status: "todo",
    id: ""
  };
  previewTask: ITask = {
    title: "",
    description: "",
    contacts: [],
    date: 0,
    priority: "mid",
    category: "",
    subtasks: [],
    status: "",
    id: ""
  };
  contacts: IContact[] = [];

  isUserStory = false;
  editView = false;
  prioImagePath = "";
  dropdownOpen = false;
  searchTerm: string = "";
  filteredContacts: IContact[] = [];


  constructor(private taskDataService: TaskDataService, private contactService: ContactService, public cdRef: ChangeDetectorRef) {

  }


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

  initTask() {
    if (this.task.category == "User Story") {
      this.isUserStory = true;
    }
  }

  filterContacts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query)
    );
    this.cdRef.detectChanges();
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

  changeSubtaskStatus(name: string) {
    this.task.subtasks!.forEach(element => {
      if (element.subtaskName == name) {
        element.subtaskDone = !element.subtaskDone;
      }
    });
    this.editTask();
  }

  editTask(inEditMode = false) {
    console.log(this.task);
    
    if (inEditMode) {
      Object.assign(this.task, this.previewTask);
      this.toggleEditMode();
    }
    this.taskDataService.updateTask(this.currentTaskId, this.task)
    this.cdRef.detectChanges();
  }

  deleteTask() {

  }

  toggleEditMode() {
    this.editView = !this.editView;
    this.cdRef.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isClickInsideDropdown(event)) {
      this.closeDropdown();
    }
  }

  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges(); 
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.cdRef.detectChanges();
  }

  isClickInsideDropdown(event: Event): boolean {
    const dropdownContainer = document.querySelector(".assignment-container");
    return dropdownContainer?.contains(event.target as Node) ?? false;
  }

  toggleContactAssignment(contactId: string) {
    const index = this.previewTask.contacts!.indexOf(contactId);
    if (index === -1) {
      this.previewTask.contacts!.push(contactId); 
    } else {
      this.previewTask.contacts!.splice(index, 1);
    }
  }
}
