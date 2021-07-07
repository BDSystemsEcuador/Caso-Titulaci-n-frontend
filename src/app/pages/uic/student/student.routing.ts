import { InscriptionComponent } from './inscription/inscription.component';
  
// Angular Router
import {Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import { StudentComponent } from './student.component';

// My Components

export const StudentRouting: Routes = [
    {
        path: 'requirements',
        component: StudentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'inscription',
        component: InscriptionComponent,
        canActivate: [AuthGuard]
    }
];