  
// Angular Router
import {Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import { ConvocatoryFormComponent } from './convocatory/convocatory-form/convocatory-form.component';
import { CoordinatorComponent } from './coordinator.component';

// My Components

export const CoordinatorRouting: Routes = [
    {
        path: '',
        component: CoordinatorComponent,
        canActivate: [AuthGuard]
    }
];