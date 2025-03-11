import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { ISubtask, ITask } from '../../../interfaces/itask';
import { IContact } from '../../../interfaces/icontact';
import { TaskDataService } from '../../../services/task-data.service';
import { ContactService } from '../../../services/contact-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Component for showing detailed information and editing task.
 */
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
    contacts: ["Andi", "Hendrik"],
    date: '0',
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
  previewTask!: ITask;
  contacts!: IContact[];
  filteredContacts: IContact[] = [];
  today: string = new Date().toISOString().split("T")[0];
  editingSubtasks = new Map<string, boolean>();

  isUserStory = false;
  editView = false;
  prioImagePath = "";
  dropdownOpen = false;
  searchTerm: string = "";
  subtaskTerm: string = "";

  constructor(private taskDataService: TaskDataService, private contactService: ContactService, public cdRef: ChangeDetectorRef) {

  }


  /**
    * Initializes the task and checks if it is a user story.
    */
  initTask() {
    if (this.task.category == "User Story") {
      this.isUserStory = true;
    }
  }

  /**
   * Filters contacts based on user input.
   * @param {Event} event - The event triggered by user input.
   */
  filterContacts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query)
    );
    this.cdRef.detectChanges();
  }

  /**
   * Returns the image path based on the task priority.
   * @param {string} prio - The priority of the task.
   * @param {boolean} [forceInactive=false] - Whether to show the inactive image.
   * @returns {string} The path to the priority image.
   */
  getPrioImagePath(prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else {
      return this.previewTask.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    }
  }

  /**
   * Changes the priority of the task.
   * @param {string} prio - The new priority.
   */
  changePriority(prio: string) {
    this.previewTask.priority = prio;
  }

  /**
   * Checks if a given priority is active.
   * @param {string} prio - The priority to check.
   * @returns {boolean} True if the priority is active, otherwise false.
   */
  isPriorityActive(prio: string): boolean {
    return this.previewTask.priority === prio;
  }

  /**
   * Toggles the completion status of a subtask.
   * @param {ISubtask} subtask - The subtask to update.
   */
  toggleSubtaskDone(subtask: ISubtask) {
    subtask.subtaskDone = !subtask.subtaskDone;
    this.taskDataService.updateTask(this.currentTaskId, this.task);
    this.cdRef.detectChanges();
  }

  /**
   * Changes the status of a subtask based on its name.
   * @param {string} name - The name of the subtask.
   */
  changeSubtaskStatus(name: string) {
    this.task.subtasks!.forEach(element => {
      if (element.subtaskName == name) {
        element.subtaskDone = !element.subtaskDone;
      }
    });
    this.editTask();
  }

  /**
   * Updates the task and saves changes.
   * @param {boolean} [inEditMode=false] - Whether the task is in edit mode.
   */
  editTask(inEditMode = false) {
    if (inEditMode) {
      Object.assign(this.task, this.previewTask);
      this.toggleEditMode();
    }
    this.taskDataService.updateTask(this.currentTaskId, this.task);
    this.cdRef.detectChanges();
  }

  /**
   * Deletes the task and closes the dialog.
   */
  deleteTask() {
    this.taskDataService.deleteTask(this.currentTaskId);
    this.close();
  }

  /**
   * Toggles the edit mode.
   */
  toggleEditMode() {
    this.editView = !this.editView;
    this.cdRef.detectChanges();
  }

  /**
   * Closes the dropdown menu when clicking outside of it.
   * @param {Event} event - The click event.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isClickInsideDropdown(event)) {
      this.closeDropdown();
    }
  }

  /**
   * Opens the dropdown menu.
   * @param {Event} event - The click event.
   */
  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges();
  }

  /**
   * Closes the dropdown menu.
   */
  closeDropdown() {
    this.dropdownOpen = false;
    this.cdRef.detectChanges();
  }

  /**
   * Checks if the click event occurred inside the dropdown.
   * @param {Event} event - The click event.
   * @returns {boolean} True if the click was inside the dropdown, otherwise false.
   */
  isClickInsideDropdown(event: Event): boolean {
    const dropdownContainer = document.querySelector(".assignment-container");
    return dropdownContainer?.contains(event.target as Node) ?? false;
  }

  /**
   * Toggles the assignment of a contact to the task.
   * @param {string} contactId - The ID of the contact.
   */
  toggleContactAssignment(contactId: string) {
    const index = this.previewTask.contacts!.indexOf(contactId);
    if (index === -1) {
      this.previewTask.contacts!.push(contactId);
    } else {
      this.previewTask.contacts!.splice(index, 1);
    }
  }

  /**
   * Adds a new subtask.
   */
  addSubtask() {
    if (this.subtaskTerm == "") {
      return;
    }

    this.previewTask.subtasks?.push({ subtaskName: this.subtaskTerm, subtaskDone: false });
    this.subtaskTerm = "";
    this.cdRef.detectChanges();
  }

  /**
   * Starts editing a subtask.
   * @param {string} subtaskName - The name of the subtask.
   */
  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, true);
  }

  /**
   * Saves the edited subtask.
   * @param {string} oldName - The original name of the subtask.
   */
  saveSubtaskEdit(oldName: string) {
    const subtask = this.previewTask.subtasks?.find(s => s.subtaskName === oldName);
    if (subtask) {
      subtask.subtaskName = oldName;
    }
    this.editingSubtasks.delete(oldName);
    this.cdRef.detectChanges();
  }

  /**
   * Cancels the editing of a subtask.
   * @param {string} subtaskName - The name of the subtask.
   */
  cancelSubtaskEdit(subtaskName: string) {
    this.editingSubtasks.delete(subtaskName);
  }

  /**
   * Deletes a subtask by name.
   * @param {string} name - The name of the subtask to delete.
   */
  deleteSubTask(name: string) {
    this.previewTask.subtasks = this.previewTask.subtasks?.filter(subtask => subtask.subtaskName != name);
    this.cdRef.detectChanges();
  }
}