  
// Angular Router
import {Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import { StudentComponent } from './student.component';

// My Components

export const StudentRouting: Routes = [
    {
        path: '',
        component: StudentComponent,
        canActivate: [AuthGuard]
    }
];