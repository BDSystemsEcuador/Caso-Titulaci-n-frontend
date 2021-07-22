import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import { File } from 'src/app/models/app/file';
import { AppHttpService } from './app-http.service';

@Injectable({
    providedIn: 'root'
})

export class AppService {
    private headers: HttpHeaders;

    constructor(private httpClient: HttpClient, private appHttpService:AppHttpService ) {

    }

    get(url: string) {
        url = environment.API_URL_APP + url;
        return this.httpClient.get(url, {headers: this.headers});
    }

    post(url: string, data: any) {
        url = environment.API_URL_APP + url;
        return this.httpClient.post(url, data, {headers: this.headers});
    }

    update(url: string, data: any) {
        url = environment.API_URL_APP + url;
        return this.httpClient.put(url, data, {headers: this.headers});
    }

    delete(url: string) {
        url = environment.API_URL_APP + url;
        return this.httpClient.delete(url, {headers: this.headers});
    }

    uploadFiles(data: FormData, params = new HttpParams()) {
        const url = environment.API_URL_APP + 'files';
        return this.httpClient.post(url, data, {params});
    }

    uploadImages(data: FormData, params = new HttpParams()) {
        const url = environment.API_URL_APP + 'images';
        return this.httpClient.post(url, data, {params});
    }

    getCatalogues(params = new HttpParams()) {
        const url = environment.API_URL_APP + 'catalogues';
        return this.httpClient.get(url, {params});
    }

    getLocations(params = new HttpParams()) {
        const url = environment.API_URL_APP + 'locations';
        return this.httpClient.get(url, {params});
    }

    getCountries(params = new HttpParams()) {
        const url = environment.API_URL_APP + 'countries';
        return this.httpClient.get(url, {params});
    }
    downloadFile(file: File) {
        const params = new HttpParams().append('full_path', file.full_path);
        this.appHttpService.getFile(params).subscribe(response => {
            const binaryData = [];
            binaryData.push(response);
            const filePath = URL.createObjectURL(new Blob(binaryData, {type: response['type']}));
            const downloadLink = document.createElement('a');
            downloadLink.href = filePath;
            downloadLink.setAttribute('download', file.full_name);
        })}
}
