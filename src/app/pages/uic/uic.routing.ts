import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../shared/guards/auth.guard';
import { CoordinatorComponent } from './coordinator/coordinator.component';

export const UicRouting: Routes = [
  {
    path:'',
    children: [
      {
        path: 'coordinator',
        loadChildren: () => import('./coordinator/coordinator.module').then(m => m.CoordinatorModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'student',
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];