import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase-service.service';
import { TaskDataService } from '../../services/task-data.service';
import { ITask } from '../../interfaces/itask';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  isGuest = false;
  currentUser = "";
  tasks: ITask[] = [];
  upcomingTask!: ITask;

  constructor(public firebaseService: FirebaseService, private taskDataService: TaskDataService, private authService: AuthService) {
    if (authService.getUserName() && authService.getUserName() != "Guest") {
      this.currentUser = authService.getUserName();
    }
  }

  /**
   * Lifecycle Hook: Wird bei der Initialisierung des Komponenten aufgerufen.
   * Abonniert die Liste der Aufgaben und bereitet sie für die Anzeige vor.
   */
  ngOnInit() {
    this.taskDataService.getTasks().subscribe((taskList) => {
      this.tasks = taskList.map(task => ({
        ...task,
        parsedDate: this.parseDate(task.date) ?? null,
      }));
      this.findUpcomingTask();
    });
  }

  /**
   * Wandelt einen Datums-String in ein Date-Objekt um.
   * Unterstützt verschiedene Datumsformate.
   * @param dateString - Der zu parsende Datums-String.
   * @returns Ein Date-Objekt oder null, wenn der String ungültig ist.
   */
  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    if (dateString.includes("-")) {
      return new Date(dateString);
    } else if (dateString.includes(".")) {
      const parts = dateString.split(".").map(Number);
      return new Date(parts[2], parts[1] - 1, parts[0]); 
    }
    return null;
  }
  
  /**
   * Findet die nächste anstehende Aufgabe basierend auf dem aktuellen Datum.
   * Setzt die Eigenschaft 'upcomingTask' auf die nächstgelegene Aufgabe.
   */
  findUpcomingTask() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.upcomingTask = this.tasks
      .filter(task => task.parsedDate && task.parsedDate >= today && task.status !== "done")
      .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0];
  }

  /**
   * Gibt eine Begrüßungsnachricht basierend auf der aktuellen Uhrzeit zurück.
   * @returns Eine Begrüßungsnachricht als String.
   */
  getWelcomeMessage(): string {
    const currentDate = new Date().getHours();
    if (currentDate < 12) {
      return "Good morning";
    } else if (currentDate < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  /**
   * Gibt das Datum der nächsten anstehenden Aufgabe zurück.
   * @returns Das Datum als formatierter String oder eine Nachricht, wenn keine Aufgabe vorhanden ist.
   */
  getDateOfUpcomingTask(): string {
    if (!this.upcomingTask || !this.upcomingTask.parsedDate) {
      return "No upcoming tasks";
    }
  
    return this.upcomingTask.parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Gibt die Priorität der nächsten anstehenden Aufgabe zurück.
   * @returns Die Priorität der Aufgabe oder eine Nachricht, wenn keine Aufgabe vorhanden ist.
   */
  getUpcomingTaskPrio(): string {
    if (!this.upcomingTask) { return "No upcoming tasks"; }
    return this.upcomingTask.priority;
  }

  /**
   * Gibt die CSS-Klasse basierend auf der Priorität der nächsten anstehenden Aufgabe zurück.
   * @returns Eine CSS-Klasse als String.
   */
  getUpcomingTaskPrioClass(): string {
    return `bg-${this.getUpcomingTaskPrio().toLocaleLowerCase()}`;
  }

  /**
   * Gibt den Pfad zum Symbol für die Priorität der nächsten anstehenden Aufgabe zurück.
   * @returns Der Pfad zum Symbol als String.
   */
  getUpcomingTaskPrioIcon(): string {
    return `./assets/img/add-task/${this.getUpcomingTaskPrio().toLowerCase()}-active.png`;
  }
}
