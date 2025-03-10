import { Injectable, ApplicationRef, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import { IContact } from '../interfaces/icontact';
import { EditContactDialogComponent } from '../main/contacts/edit-contact-dialog/edit-contact-dialog.component';
import { AddContactDialogComponent } from '../main/contacts/add-contact-dialog/add-contact-dialog.component';
import { DetailedDialogComponent } from '../main/board/detailed-dialog/detailed-dialog.component';
import { AddTaskComponent } from '../main/add-task/add-task.component';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  /**
   * Referenz auf das aktuell geöffnete Overlay-Component.
   */
  private overlayComponentRef: ComponentRef<
    EditContactDialogComponent | AddContactDialogComponent | DetailedDialogComponent | AddTaskComponent
  > | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  /**
   * Öffnet das Overlay zur Bearbeitung eines Kontakts.
   * @param contact - Der Kontakt, der bearbeitet werden soll.
   */
  openEditContactOverlay(contact: IContact): void {
    const container = this.createOverlayContainer();

    this.overlayComponentRef = createComponent(EditContactDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('contact', contact);
    this.overlayComponentRef.setInput('close', () => this.closeOverlay(container));
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Öffnet das Overlay zur Bearbeitung eines Tasks.
   * @param id - Die ID des Tasks, der bearbeitet werden soll.
   */
  openEditTaskOverlay(id: string): void {
    const container = this.createOverlayContainer();

    this.overlayComponentRef = createComponent(DetailedDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('currentTaskId', id);
    this.overlayComponentRef.setInput('close', () => this.closeOverlay(container));
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Öffnet das Overlay zum Hinzufügen eines Tasks mit einem vordefinierten Status.
   * @param status - Der vorgegebene Status für den neuen Task.
   */
  openAddTaskOverlay(status: string): void {
    const container = this.createOverlayContainer();

    this.overlayComponentRef = createComponent(AddTaskComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('predefinedStatus', status);
    this.overlayComponentRef.setInput('isOverlay', true);
    this.overlayComponentRef.setInput('close', () => this.closeOverlay(container));
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Öffnet das Overlay zum Hinzufügen eines neuen Kontakts.
   */
  openAddContactOverlay(): void {
    const container = this.createOverlayContainer();

    this.overlayComponentRef = createComponent(AddContactDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('close', () => this.closeOverlay(container));
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Erstellt ein HTML-Container-Element für das Overlay.
   * @returns Das erstellte `div`-Element.
   */
  private createOverlayContainer(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);
    return container;
  }

  /**
   * Schließt das aktuell geöffnete Overlay und entfernt dessen Container aus dem DOM.
   * @param container - Das `div`-Element, das das Overlay enthält.
   */
  closeOverlay(container: HTMLElement): void {
    if (this.overlayComponentRef) {
      this.overlayComponentRef.destroy();
      this.overlayComponentRef = null;
    }
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
  }
}
