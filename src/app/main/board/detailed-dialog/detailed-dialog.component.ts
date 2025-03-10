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
          this.previewTask.contacts = this.previewTask.contacts!.filter(contact => contact != '');
        }
      });
    });
    this.initTask();
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
   * Gibt den Pfad zu einem Bild basierend auf der Priorität zurück.
   * @param prio Die Priorität der Aufgabe.
   * @param forceInactive Gibt an, ob das Bild als inaktiv angezeigt werden soll.
   * @returns Der Pfad zum Bild.
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
   * Ändert die Priorität der Aufgabe.
   * @param prio Die neue Priorität.
   */
  changePriority(prio: string) {
    this.previewTask.priority = prio;
  }

  /**
   * Überprüft, ob eine Priorität aktiv ist.
   * @param prio Die zu überprüfende Priorität.
   * @returns Wahr, wenn die Priorität aktiv ist, andernfalls falsch.
   */
  isPriorityActive(prio: string): boolean {
    return this.previewTask.priority === prio;
  }

  /**
   * Wechselt den Status einer Unteraufgabe.
   * @param subtask Die Unteraufgabe, deren Status geändert wird.
   */
  toggleSubtaskDone(subtask: ISubtask) {
    subtask.subtaskDone = !subtask.subtaskDone;
    this.taskDataService.updateTask(this.currentTaskId, this.task);
    this.cdRef.detectChanges();
  }

  /**
   * Ändert den Status einer Unteraufgabe basierend auf ihrem Namen.
   * @param name Der Name der Unteraufgabe.
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
   * Bearbeitet die Aufgabe und aktualisiert sie im Dienst.
   * @param inEditMode Gibt an, ob die Aufgabe im Bearbeitungsmodus ist.
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
   * Löscht die Aufgabe und schließt den Dialog.
   */
  deleteTask() {
    this.taskDataService.deleteTask(this.currentTaskId);
    this.close();
  }

  /**
   * Wechselt den Bearbeitungsmodus.
   */
  toggleEditMode() {
    this.editView = !this.editView;
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
   * Öffnet das Dropdown-Menü.
   * @param event Das Klick-Ereignis.
   */
  openDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = true;
    this.cdRef.detectChanges();
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
   * Wechselt die Zuweisung eines Kontakts zur Aufgabe.
   * @param contactId Die ID des Kontakts.
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
   * Fügt eine neue Unteraufgabe hinzu.
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
   * Beginnt die Bearbeitung einer Unteraufgabe.
   * @param subtaskName Der Name der Unteraufgabe.
   */
  startEditingSubtask(subtaskName: string) {
    this.editingSubtasks.set(subtaskName, true);
  }

  /**
   * Speichert die Bearbeitung einer Unteraufgabe.
   * @param oldName Der alte Name der Unteraufgabe.
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
    this.previewTask.subtasks = this.previewTask.subtasks?.filter(subtask => subtask.subtaskName != name);
    this.cdRef.detectChanges();
  }
}
