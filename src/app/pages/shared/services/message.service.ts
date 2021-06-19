import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class MessageService {

    error(error) {
        if (error.status === 400) {
            if (error.error.msg.code === '23505') {
                return Swal.fire({
                    title: 'El registro ya existe',
                    text: error.error.data,
                    icon: 'error'
                });
            }
        }
        if (error.status === 404) {
            return Swal.fire({
                title: error.error.msg.summary,
                text: error.error.msg.detail,
                icon: 'warning'
            });
        }
        if (error.status === 422) {
            let i;
            const fields = Object.values(error.error.msg.detail).toString().split('.,');
            let html = '<ul>';
            for (i = 0; i < fields.length - 1; i++) {
                html += `<li>${fields[i]}.</li>`;
            }
            html += `<li>${fields[i]}</li>`;
            html += '</ul>';
            return Swal.fire({
                title: error.error.msg.summary,
                html,
                icon: 'error'
            });
        }

        return Swal.fire({
            title: error.error.msg.summary,
            text: error.error.msg.detail,
            icon: 'error'
        });
    }

    success(response) {
        return Swal.fire({
            title: response.msg.summary,
            text: response.msg.detail,
            icon: 'info'
        }).then(response);
    }

    questionDelete({title = '¿Está seguro de eliminar?', text = 'No podrá recuperar esta información!'}) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="pi pi-trash"> Si, eliminar</i>'
        });
    }

    get fieldRequired(): string {
        return 'El campo es obligatorio.';
    }

    get fieldEmail(): string {
        return 'El campo debe tener un fomato de correo valido.';
    }

    fieldMinLength(field) {
        return `Mínimo de caracteres es ${field.errors.minlength.requiredLength}.`;
    }

    fieldMaxLength(field): string {
        return `Máximo de caracteres es ${field.errors.maxlength.requiredLength}.`;
    }

    get fieldNoPasswordMatch(): string {
        return 'Las contraseñas no coinciden.';
    }

    paginatorTotalRegisters(paginator): string {
        return 'En total hay ' + (paginator?.total ? paginator.total : 0) + ' registros.';
    }
}