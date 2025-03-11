import { Component, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { ContactService } from '../../services/contact-service.service';
import { TaskDataService } from '../../services/task-data.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IContact } from '../../interfaces/icontact';
import { ITask } from '../../interfaces/itask';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})

/**
 * Component for adding a new task.
 */
export class AddTaskComponent {
  @Input() predefinedStatus = "todo";
  @Input() close!: () => void;
  @Input() isOverlay = false;


  today: string = new Date().toISOString().split("T")[0];
  selectedDate: string | null = null;

  editingSubtasks = new Map<string, string>();
  filteredContacts: IContact[] = [];
  contactsFromList: IContact[] = [];
  saveDateTestArray: string[] = [];
  sortedContacts: IContact[] = [];
  newSubtaskName: string = '';
  subtaskTerm: string = "";
  searchTerm: string = "";
  contacts!: IContact[];
  dropdownOpen = false;
  isUserStory = false;
  taskAdded = false;
  task: ITask =
    {
      title: '',
      description: '',
      contacts: [],
      date: '10.10.2020',
      priority: 'Medium',
      category: 'User Story',
      subtasks: [],
      status: this.predefinedStatus,
      id: '',
    };

  taskCategories: { category: string }[] = [
    { category: 'Technical Task' },
    { category: 'User Story' }
  ];
  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef, private taskDataService: TaskDataService, private router: Router) { };

  ngOnInit() {
    this.contactService.getContacts().subscribe((contactList) => {
      this.contacts = contactList;
      this.filteredContacts = [...this.contacts];
      this.cdRef.detectChanges();
    });
  }
  
  /**
   * Filters contacts based on user input.
   * @param event The event triggering the input.
   */
  filterContacts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query)
    );
    this.cdRef.detectChanges();
  }

  /**
   * Closes the dropdown menu when clicking outside.
   * @param event The click event.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isClickInsideDropdown(event)) {
      this.closeDropdown();
    }
  }

  /**
   * Closes the dropdown menu.
   */
  closeDropdown() {
    this.dropdownOpen = false;
    this.cdRef.detectChanges();
  }

  /**
   * Checks if the click occurred inside the dropdown.
   * @param event The click event.
   * @returns True if the click occurred inside, otherwise false.
   */
  isClickInsideDropdown(event: Event): boolean {
    const dropdownContainer = document.querySelector(".assignment-container");
    return dropdownContainer?.contains(event.target as Node) ?? false;
  }

  /**
   * Opens the dropdown menu.
   * @param event The click event.
   */
  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges();
  }

  /**
   * Initializes the task and checks if it is a User Story.
   */
  initTask() {
    if (this.task.category === "User Story") {
      this.isUserStory = true;
    }
  }

  /**
   * Toggles the assignment of a contact to the task.
   * @param contactId The ID of the contact.
   */
  toggleContactAssignment(contactId: string) {
    const index = this.task.contacts!.indexOf(contactId);
    if (index === -1) {
      this.task.contacts!.push(contactId);
    } else {
      this.task.contacts!.splice(index, 1);
    }
  }

  /**
   * Returns the image path based on the task priority.
   * @param prio The priority of the task.
   * @param forceInactive Whether to display the inactive image.
   * @returns The image path.
   */
  getPrioImagePath(prio: string, forceInactive = false): string {
    if (forceInactive) {
      return `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    } else {
      return this.task.priority === prio
        ? `./assets/img/add-task/${prio.toLowerCase()}-active.png`
        : `./assets/img/add-task/${prio.toLowerCase()}-inactive.png`;
    }
  }

  /**
   * Changes the priority of the task.
   * @param prio The new priority.
   */
  changePriority(prio: string) {
    this.task.priority = prio;
  }

  /**
   * Checks if a priority is active.
   * @param prio The priority to check.
   * @returns True if the priority is active, otherwise false.
   */
  isPriorityActive(prio: string): boolean {
    return this.task.priority === prio;
  }

  /**
   * Returns the formatted task date.
   * @returns The formatted date.
   */
  getDate() {
    return this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : '';
  }

  /**
   * Adds a new subtask.
   * @param event Optional event to prevent default behavior.
   */
  addSubtask(event?: Event) {
    if (event) event.preventDefault();
    if (!this.newSubtaskName) return;
    
    this.task.subtasks?.push({ subtaskName: this.newSubtaskName, subtaskDone: false });
    this.newSubtaskName = "";
    this.cdRef.detectChanges();
  }

  /**
   * Starts editing a subtask.
   * @param subtaskName The name of the subtask.
   */
  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, subtaskName);
  }

  /**
   * Updates the edited subtask with a new value.
   * @param subtaskName The name of the subtask.
   * @param newValue The new value of the subtask.
   */
  updateEditingSubtask(subtaskName: string, newValue: string) {
    this.editingSubtasks.set(subtaskName, newValue);
  }

  /**
   * Saves the edited subtask.
   * @param oldName The old name of the subtask.
   * @param event Optional event to prevent default behavior.
   */
  saveSubtaskEdit(oldName: string, event?: Event) {
    if (event) event.preventDefault();
    
    const subtask = this.task.subtasks?.find(s => s.subtaskName === oldName);
    if (subtask) {
      subtask.subtaskName = this.editingSubtasks.get(oldName) || oldName;
    }
    this.editingSubtasks.delete(oldName);
    this.cdRef.detectChanges();
    (event?.target as HTMLInputElement)?.blur();
  }

  /**
   * Cancels subtask editing.
   * @param subtaskName The name of the subtask.
   */
  cancelSubtaskEdit(subtaskName: string) {
    this.editingSubtasks.delete(subtaskName);
  }

  /**
   * Deletes a subtask based on its name.
   * @param name The name of the subtask to delete.
   */
  deleteSubTask(name: string) {
    this.task.subtasks = this.task.subtasks?.filter(subtask => subtask.subtaskName !== name);
    this.cdRef.detectChanges();
  }

  /**
   * Clears the subtask input field.
   */
  clearSubtask() {
    this.newSubtaskName = "";
  }

  /**
   * Clears the form and resets the task.
   * @param form The form to reset.
   */
  clearForm(form: NgForm) {
    form.resetForm();
    this.task.contacts = [];
    this.task.subtasks = [];
    this.changePriority('Medium');
  }

  /**
   * Submits the task and saves it to the service.
   * @param form The form to submit.
   */
  async submitTask(form: NgForm) {
    if (form.valid && form.submitted) {
      this.getDate();
    }
    this.taskAdded = true;
    this.task.status = this.predefinedStatus;
    
    await this.taskDataService.addTask(this.task).then(() => {
      form.resetForm();
      this.task.contacts = [];
      this.task.subtasks = [];
      setTimeout(() => {
        this.taskAdded = false;
        this.router.navigate(['/board']);
      }, 1500);
    });
  }
}