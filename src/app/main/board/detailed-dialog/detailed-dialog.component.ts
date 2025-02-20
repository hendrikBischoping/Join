import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';
import { IContact } from '../../../interfaces/icontact';
import { TaskDataService } from '../../../services/task-data.service';
import { ContactService } from '../../../services/contact-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
      }
    ],
      status: "todo",
      id: ""
    };
    contacts: IContact[] = [];

    isUserStory = false;
    editView = true;
    prioImagePath = "";
    dropdownOpen = false;
    searchTerm: string = "";
    filteredContacts : IContact[] = [];

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
          }
        });
      });
      this.initTask();
      
    }

    initTask() {
      if (this.task.category == "User Story") {
        this.isUserStory = true;
      }
      this.prioImagePath = this.getPrioImagePath();
    }

    filterContacts(event: any) {
      const query = event.target.value.toLowerCase();
      this.filteredContacts = this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(query)
      );
  
      console.log("Filtered Contacts:", this.filteredContacts); // Debugging
      this.cdRef.detectChanges();
    }

    getPrioImagePath():string {
      switch (this.task.priority) {
        case "low": return "./assets/img/icons/TaskLowIcon.png";
        case "mid": return "./assets/img/icons/TaskMediumIcon.png";
        case "high": return "./assets/img/icons/TaskHighIcon.png";
      }
      return "";
    }

    editTask(inEditMode = false) {
      this.taskDataService.updateTask(this.currentTaskId, this.task)
      
      if (inEditMode) {
        this.toggleEditMode();
      }
    }

    deleteTask() {
      
    }

    toggleEditMode() {
      this.editView = !this.editView;
      this.cdRef.detectChanges();
    }

    openDropdown() {
      this.dropdownOpen = true;
      this.cdRef.detectChanges(); // Manuelles Aktualisieren der Ansicht
    }
  
    closeDropdown() {
      setTimeout(() => { 
        this.dropdownOpen = false;
        this.cdRef.detectChanges();
      }, 200); // Kleines Delay, damit Klicks noch registriert werden
    }

    toggleContactAssignment(contactId: string) {
      const index = this.task.contacts!.indexOf(contactId);
      if (index === -1) {
        this.task.contacts!.push(contactId); // Falls der Kontakt nicht drin ist → hinzufügen
      } else {
        this.task.contacts!.splice(index, 1); // Falls der Kontakt drin ist → entfernen
      }
      this.cdRef.markForCheck();
    }
}
