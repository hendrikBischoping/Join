import { Routes } from '@angular/router';
import { SummaryComponent } from './main/summary/summary.component';
import { BoardComponent } from './main/board/board.component';
import { AddTaskComponent } from './main/add-task/add-task.component';
import { ContactsComponent } from './main/contacts/contacts.component';

export const routes: Routes = [
    { path: 'summary', component: SummaryComponent },
    { path: 'board', component: BoardComponent },
    { path: 'add-task', component: AddTaskComponent },
    { path: 'contacts', component: ContactsComponent }
];
