import { Injectable, ApplicationRef, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import { IContact } from '../interfaces/icontact';
import { EditContactDialogComponent } from '../main/contacts/edit-contact-dialog/edit-contact-dialog.component';
import { AddContactDialogComponent } from '../main/contacts/add-contact-dialog/add-contact-dialog.component';
import { DetailedDialogComponent } from '../main/board/detailed-dialog/detailed-dialog.component';
import { AddTaskComponent } from '../main/add-task/add-task.component';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private overlayComponentRef: ComponentRef<EditContactDialogComponent | AddContactDialogComponent | DetailedDialogComponent | AddTaskComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  openEditContactOverlay(contact: IContact): void {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);

    this.overlayComponentRef = createComponent(EditContactDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('contact', contact);
    this.overlayComponentRef.setInput('close', () => {
      this.closeOverlay(container);
    });
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  openEditTaskOverlay(id: string): void {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);

    this.overlayComponentRef = createComponent(DetailedDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('currentTaskId', id);
    this.overlayComponentRef.setInput('close', () => {
      this.closeOverlay(container);
    });
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  openAddTaskOverlay(status:string): void {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);

    this.overlayComponentRef = createComponent(AddTaskComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('predefinedStatus', status);
    this.overlayComponentRef.setInput('isOverlay', true);
    this.overlayComponentRef.setInput('close', () => {
      this.closeOverlay(container);
    });
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

  openAddContactOverlay(): void {
    const container = document.createElement('div');
    container.classList.add('custom-overlay-container');
    document.body.appendChild(container);

    this.overlayComponentRef = createComponent(AddContactDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: container
    });

    this.overlayComponentRef.setInput('close', () => {
      this.closeOverlay(container);
    });
    this.overlayComponentRef.changeDetectorRef.detectChanges();
  }

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