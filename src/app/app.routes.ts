import { Routes } from '@angular/router';
import { SummaryComponent } from './main/summary/summary.component';
import { BoardComponent } from './main/board/board.component';
import { AddTaskComponent } from './main/add-task/add-task.component';
import { ContactsComponent } from './main/contacts/contacts.component';
import { HelpComponentComponent } from './main/help-component/help-component.component';
import { LegalNoticeComponent } from './main/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: 'summary', component: SummaryComponent },
    { path: 'board', component: BoardComponent },
    { path: 'add-task', component: AddTaskComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'help-component/:returnHelp', component: HelpComponentComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-police', component: PrivacyPolicyComponent },
];
