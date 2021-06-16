import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

// Application Components
import {AppMainComponent} from './shared/components/main/app.main.component';
import {AppBlankComponent} from './shared/components/blank/app.blank.component';

// Application Guards
import {AuthGuard} from './shared/guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    // {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
                    {path: '', redirectTo: '/uic/coordinator', pathMatch: 'full'},
                    // {
                    //     path: 'dashboard',
                    //     loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
                    //     canActivate: [AuthGuard]
                    // },
                    {
                        path: 'uic',
                        loadChildren: () => import('./pages/uic/uic.module').then(m => m.UicModule),
                        canActivate: [AuthGuard]
                    }
                    // {
                    //     path: 'user',
                    //     loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
                    //     canActivate: [AuthGuard]
                    // }
                ]
            },
            {
                path: 'auth',
                component: AppBlankComponent,
                loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
            },
            {path: '**', redirectTo: '/auth/not-found'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRouting{
}
