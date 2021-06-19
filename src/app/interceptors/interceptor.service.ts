import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth/auth.service';
import {System, Token} from '../models/auth/models.index';
import {getToken} from 'codelyzer/angular/styles/cssLexer';
import {MessageService} from '../pages/shared/services/message.service';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router,private messageService: MessageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;
        let params = req.params;
        headers = headers.append('Accept', 'application/json');

        if (this.authService.getSystem()) {
            params = params.append('system', this.authService.getSystem().id.toString());
        }
        if (this.authService.getToken()) {
            headers = headers.append(
                'Authorization', 'Bearer ' + this.authService.getToken().access_token);
            if (!req.params.has('page')) {
                params = params.append('page', '1');
            }
            if (!req.params.has('per_page')) {
                params = params.append('per_page', '10');
            }
            if (this.authService.getInstitution()) {
                params = params.append('institution', this.authService.getInstitution().id.toString());
            }
            if (this.authService.getRole()) {
                params = params.append('role', this.authService.getRole().id.toString());
            }
            if (this.authService.getUri()) {
                params = params.append('uri', this.authService.getUri());
            }
        }

        return next.handle(req.clone({headers, params})).pipe(catchError(error => {
            // Cuando la aplicación o una ruta está en mantenimiento
            if (error.status === 503) {
                this.authService.removeLogin();
                this.router.navigate(['/auth/under-maintenance']);
            }

            // Cuando el usuario no tiene permisos para acceder a la ruta solicitada y se encuentra logueado
            if ((error.status === 401 || error.status === 403 || error.status === 423) && this.authService.getToken()) {
                this.authService.removeLogin();
                this.router.navigate(['/auth/access-denied']);
            }

            // Cuando el usuario no tiene permisos para acceder a la ruta solicitada y no está logueado
            if ((error.status === 401 || error.status === 403 || error.status === 423) && !this.authService.getToken()) {
                this.authService.removeLogin();
                this.router.navigate(['/auth/login']);
            }

            return throwError(error);
        }));
    }
}