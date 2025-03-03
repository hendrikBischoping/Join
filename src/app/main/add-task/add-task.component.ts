import { Component, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { ContactService } from '../../services/contact-service.service';
import { TaskDataService } from '../../services/task-data.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IContact } from '../../interfaces/icontact';
import { ITask } from '../../interfaces/itask';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})

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
      contacts: [""],
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
  constructor(private contactService: ContactService, public cdRef: ChangeDetectorRef, private taskDataService: TaskDataService,) { };

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
    this.cdRef.detectChanges();
  }

  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, subtaskName); // Originalname in Map speichern
  }

  updateEditingSubtask(subtaskName: string, newValue: string) {
    this.editingSubtasks.set(subtaskName, newValue); // Temporären Wert aktualisieren
  }

  saveSubtaskEdit(oldName: string, event?: Event) {
    if (event) {
      event.preventDefault(); // Verhindert das Standardverhalten von Enter in Formularen
    }
    const subtask = this.task.subtasks?.find(s => s.subtaskName === oldName);
    if (subtask) {
      subtask.subtaskName = this.editingSubtasks.get(oldName) || oldName; // Speichern der Änderung
    }
    this.editingSubtasks.delete(oldName); // Entfernen aus Map (Bearbeitungsmodus beenden)
    this.cdRef.detectChanges();
    (event?.target as HTMLInputElement)?.blur();
  }

  cancelSubtaskEdit(subtaskName: string) {
    this.editingSubtasks.delete(subtaskName); // Abbrechen, Änderungen verwerfen
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
    this.task.status = this.predefinedStatus;
    await this.taskDataService.addTask(this.task).then(() => {
      console.log("abruf", this.task.contacts);
      this.taskAdded = false;
      form.resetForm();
    })
  }
}
