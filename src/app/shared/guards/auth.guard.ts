import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import {User, Role, Permission} from '../../models/auth/models.index';
import {AuthService} from '../../services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    auth: User;
    role: Role;
    authPermissions: Permission[];

    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return true;
        const requestURL = next['_routerState']['url'];
        this.authService.setUri(requestURL);
        this.auth = this.authService.getAuth();
        this.role = this.authService.getRole();
        this.authPermissions = this.authService.getPermissions();

        if (this.auth && this.role && this.authPermissions) {
            if (requestURL === '/auth/login' && this.authService.getKeepSession()) {
                this.router.navigate(['/dashboard']);
                return true;
            }
            if (requestURL === '/dashboard' || requestURL === '/') {
                return true;
            }
            const authRoute = this.authPermissions.find(element => element.route.uri === requestURL);
            if (authRoute === undefined) {
                this.router.navigate(['/auth/not-found']);
                return false;
            }
            if (authRoute.route.status.code === '503') {
                this.router.navigate(['/auth/under-maintenance']);
                return false;
            }
            if (authRoute) {
                return true;
            }
        }
        this.router.navigate(['/auth/access-denied']);
        return false;
    }
}
