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
   * Filtert die Kontakte basierend auf der Benutzereingabe.
   * @param event Das Ereignis, das die Eingabe auslöst.
   */
  filterContacts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query)
    );
    this.cdRef.detectChanges();
  }

  /**
   * Schließt das Dropdown-Menü, wenn außerhalb geklickt wird.
   * @param event Das Klick-Ereignis.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isClickInsideDropdown(event)) {
      this.closeDropdown();
    }
  }

  /**
   * Schließt das Dropdown-Menü.
   */
  closeDropdown() {
    this.dropdownOpen = false;
    this.cdRef.detectChanges();
  }

  /**
   * Überprüft, ob der Klick innerhalb des Dropdowns erfolgt ist.
   * @param event Das Klick-Ereignis.
   * @returns Wahr, wenn der Klick innerhalb des Dropdowns erfolgt ist, andernfalls falsch.
   */
  isClickInsideDropdown(event: Event): boolean {
    const dropdownContainer = document.querySelector(".assignment-container");
    return dropdownContainer?.contains(event.target as Node) ?? false;
  }

  /**
   * Öffnet das Dropdown-Menü.
   * @param event Das Klick-Ereignis.
   */
  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges();
  }

  /**
   * Initialisiert die Aufgabe und überprüft, ob es sich um eine Benutzerstory handelt.
   */
  initTask() {
    if (this.task.category == "User Story") {
      this.isUserStory = true;
    }
  }

  /**
   * Wechselt die Zuweisung eines Kontakts zur Aufgabe.
   * @param contactId Die ID des Kontakts.
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
   * Gibt den Pfad zu einem Bild basierend auf der Priorität zurück.
   * @param prio Die Priorität der Aufgabe.
   * @param forceInactive Gibt an, ob das Bild als inaktiv angezeigt werden soll.
   * @returns Der Pfad zum Bild.
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
   * Ändert die Priorität der Aufgabe.
   * @param prio Die neue Priorität.
   */
  changePriority(prio: string) {
    this.task.priority = prio;
  }

  /**
   * Überprüft, ob eine Priorität aktiv ist.
   * @param prio Die zu überprüfende Priorität.
   * @returns Wahr, wenn die Priorität aktiv ist, andernfalls falsch.
   */
  isPriorityActive(prio: string): boolean {
    return this.task.priority === prio;
  }

  /**
   * Gibt das Datum der Aufgabe im gewünschten Format zurück.
   * @returns Das formatierte Datum.
   */
  getDate() {
    let dateData: string = this.task.date ? new Date(this.task.date).toLocaleDateString('en-US') : '';
    return dateData;
  }

  /**
   * Fügt eine neue Unteraufgabe hinzu.
   * @param event Optionales Ereignis, um das Standardverhalten zu verhindern.
   */
  addSubtask(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.newSubtaskName == "") {
      return;
    }
    this.task.subtasks?.push({ subtaskName: this.newSubtaskName, subtaskDone: false });
    this.newSubtaskName = "";
    this.cdRef.detectChanges();
  }

  /**
   * Beginnt die Bearbeitung einer Unteraufgabe.
   * @param subtaskName Der Name der Unteraufgabe.
   */
  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, subtaskName); 
  }

  /**
   * Aktualisiert die Bearbeitung einer Unteraufgabe mit einem neuen Wert.
   * @param subtaskName Der Name der Unteraufgabe.
   * @param newValue Der neue Wert der Unteraufgabe.
   */
  updateEditingSubtask(subtaskName: string, newValue: string) {
    this.editingSubtasks.set(subtaskName, newValue); 
  }

  /**
   * Speichert die Bearbeitung einer Unteraufgabe.
   * @param oldName Der alte Name der Unteraufgabe.
   * @param event Optionales Ereignis, um das Standardverhalten zu verhindern.
   */
  saveSubtaskEdit(oldName: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const subtask = this.task.subtasks?.find(s => s.subtaskName === oldName);
    if (subtask) {
      subtask.subtaskName = this.editingSubtasks.get(oldName) || oldName; 
    }
    this.editingSubtasks.delete(oldName); 
    this.cdRef.detectChanges();
    (event?.target as HTMLInputElement)?.blur();
  }

  /**
   * Bricht die Bearbeitung einer Unteraufgabe ab.
   * @param subtaskName Der Name der Unteraufgabe.
   */
  cancelSubtaskEdit(subtaskName: string) {
    this.editingSubtasks.delete(subtaskName); 
  }

  /**
   * Löscht eine Unteraufgabe basierend auf ihrem Namen.
   * @param name Der Name der zu löschenden Unteraufgabe.
   */
  deleteSubTask(name: string) {
    this.task.subtasks = this.task.subtasks?.filter(subtask => subtask.subtaskName != name);
    this.cdRef.detectChanges();
  }

  /**
   * Löscht den Inhalt des Eingabefelds für Unteraufgaben.
   */
  clearSubtask() {
    this.newSubtaskName = "";
  }

  /**
   * Löscht das Formular und setzt die Aufgabe zurück.
   * @param form Das Formular, das zurückgesetzt werden soll.
   */
  clearForm(form: NgForm) {
    form.resetForm();
    this.task.contacts = [];
    this.task.subtasks = [];
    this.changePriority('Medium');
  }

  /**
   * Übermittelt die Aufgabe und speichert sie im Dienst.
   * @param form Das Formular, das übermittelt werden soll.
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
    })
  }
}
