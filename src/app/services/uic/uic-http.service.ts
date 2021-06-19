import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment, WEB} from '../../../environments/environment';
import {Router} from '@angular/router';

import {MessageService} from '../../pages/shared/services/message.service';



@Injectable({
    providedIn: 'root'
})

export class UicHttpService {
    API_URL_UIC: string = environment.API_URL_UIC;

    constructor(private httpClient: HttpClient,
        private router: Router,
        private messageService: MessageService) {
    }

    get(url: string, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.get(url, {params});
    }

    store(url: string, data: any, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.post(url, data, {params});
    }

    update(url: string, data: any, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.put(url, data, {params});
    }

    delete(url: string, ids, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.put(url, {ids}, {params});
    }

    uploadFiles(url, data: FormData, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.post(url, data, {params});
    }

    getFiles(url, params = new HttpParams()) {
        url = this.API_URL_UIC + url;
        return this.httpClient.get(url, {params});
    }
}