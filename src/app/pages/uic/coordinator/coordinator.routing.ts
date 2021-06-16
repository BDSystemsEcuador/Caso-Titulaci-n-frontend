  
// Angular Router
import {Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import { ConvocatoryFormComponent } from './convocatory-form/convocatory-form.component';
import { CoordinatorComponent } from './coordinator.component';
import { RequirementsFormComponent } from './requirements-form/requirements-form.component';

// My Components

export const CoordinatorRouting: Routes = [
    {
        path: '',
        component: CoordinatorComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'convocatory',
      component: ConvocatoryFormComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'requirements',
      component: RequirementsFormComponent,
      canActivate: [AuthGuard]
    }
];