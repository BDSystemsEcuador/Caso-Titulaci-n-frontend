import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment, WEB} from '../../../environments/environment';
import {Institution} from '../../models/app/institution';

import {MessageService} from '../../pages/shared/services/message.service';


@Injectable({
    providedIn: 'root'
})

export class UicService {
    urlAvatar: string;
    institutions: Institution[];
    
  

    constructor(private httpClient: HttpClient, private router: Router, private messageService: MessageService) {
        this.urlAvatar = environment.STORAGE_URL;

    }
    

    }