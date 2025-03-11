import { Injectable, ApplicationRef, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import { IContact } from '../interfaces/icontact';
import { EditContactDialogComponent } from '../main/contacts/edit-contact-dialog/edit-contact-dialog.component';
import { AddContactDialogComponent } from '../main/contacts/add-contact-dialog/add-contact-dialog.component';
import { DetailedDialogComponent } from '../main/board/detailed-dialog/detailed-dialog.component';
import { AddTaskComponent } from '../main/add-task/add-task.component';

@Injectable({ providedIn: 'root' })
/**
 * Service for managing overlays for editing contacts and tasks.
 */
export class OverlayService {
  /**
   * Reference to the currently opened overlay component.
   */
  private overlayComponentRef: ComponentRef<
    EditContactDialogComponent | AddContactDialogComponent | DetailedDialogComponent | AddTaskComponent
  > | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  /**
   * Opens the overlay for editing a contact.
   * @param contact - The contact to be edited.
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
   * Opens the overlay for editing a task.
   * @param id - The ID of the task to be edited.
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
   * Opens the overlay to add a task with a predefined status.
   * @param status - The predefined status for the new task.
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
   * Opens the overlay to add a new contact.
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
   * Creates an HTML container element for the overlay.
   * @returns The created `div` element.
   */
  private createOverlayContainer(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);
    return container;
  }

  /**
   * Closes the currently opened overlay and removes its container from the DOM.
   * @param container - The `div` element that contains the overlay.
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