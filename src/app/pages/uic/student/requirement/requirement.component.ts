import { Requirement } from './../../../../models/uic/requirement';
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators";

import {AfterViewInit, Component, OnInit} from '@angular/core';
import { AppHttpService } from 'src/app/services/app/app-http.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Catalogue } from 'src/app/models/app/catalogue';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { Role } from 'src/app/models/auth/role';
//import {Document} from '../../../models/app/document';
//import {AppHttpService} from '../../../services/app/app-http.service';
//import {Catalogue} from '../../../models/app/catalogue';
//import {File} from '../../../models/app/file';
//import {Role} from '../../../models/auth/role';
//import {AuthService} from '../../../services/auth/auth.service';
//import {BreadcrumbService} from '../../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit {

  // paginator: Paginator;
  requirements: Requirement[];
  selectedRequirement: Requirement;
  // formRequirement: FormGroup;
  // requirement: Requirement;
  // requirementDialog: boolean;
  // flagRequirement: boolean;

  // constructor(
  //   private spinnerService: NgxSpinnerService,
  //   private messageService: MessageService,
  //   private formBuilder: FormBuilder,
  //   private uicHttpService: UicHttpService
  // ) {
  //   this.paginator = { current_page: 1, per_page: 5 };
  //   this.requirements = [];
  //  }

  // ngOnInit(): void {
  //   this.buildFormRequirement();
    
  //   this.getRequirements(this.paginator);
  // }

  // buildFormRequirement(){
  //   this.formRequirement = this.formBuilder.group({
  //     id: [null],
  //     name: [null, [Validators.required]],
  //     is_required: [null, [Validators.required]]

  //   });
  // }
  // getRequirements(paginator: Paginator){
  //   const params = new HttpParams()
  //     .append("page", paginator.current_page.toString())
  //     .append("per_page", paginator.per_page.toString());
  //   this.flagRequirement = true;
  //   this.uicHttpService.get("requirements", params).subscribe(
  //     (response) => {
  //       this.flagRequirement = false;
  //       this.requirements = response["data"];
  //       this.paginator = response as Paginator;
  //     },
  //     (error) => {
  //       this.flagRequirement = false;
  //       this.messageService.error(error);
  //     }
  //   );

  // }

  documents: Document[] = [];
    files: File[] = [];
    documentType: string;
    titleType: string;
    //role: Role;
    aditionalInformation: string;

    constructor(private appHttpService: AppHttpService,
                private authService: AuthService,
                public messageService: MessageService,
                private spinnerService: NgxSpinnerService,
                private breadcrumbService: BreadcrumbService,
                private uicHttpService: UicHttpService) {
        //this.role = this.authService.getRole();
        // if (this.role.code === 'CERTIFIED') {
        //     this.documentType = 'DOCUMENT';
        //     this.titleType = 'Mis Documentos';
        // }

        // if (this.role.code === 'RECERTIFIED') {
        //     this.documentType = 'CONSTANCY';
        //     this.titleType = 'Mis Constancias';
        // }

        this.breadcrumbService.setItems([
            {label: 'Dashboard', routerLink: '/dashboard'},
            {label: this.titleType},
        ]);
    }

    ngOnInit() {
        this.getFiles();
        this.getRequirements();
    }

    getRequirements(){
        this.uicHttpService.get("requirements").subscribe(
          (response) => {
            this.requirements = response["data"];
            console.log(this.requirements);
          },
          (error) => {
            this.messageService.error(error);
          }
        );
    
      }

    getFiles() {
      this.spinnerService.show();
      this.uicHttpService.getFiles("requirement/file").subscribe(
        (response) => {
          this.spinnerService.hide();
          this.files = response["data"];
        },
        (error) => {
          this.spinnerService.hide();
          this.files = [];
          this.messageService.error(error);
        }
      );
    }

    upload(event, id) {
      
      const formData = new FormData();
      for (const file of event) {
        formData.append("files[]", file);
      }
      formData.append("id", id.toString());
      this.spinnerService.show();
      this.uicHttpService.uploadFiles("requirement/file", formData).subscribe(
        (response) => {
          
          this.spinnerService.hide();
          this.messageService.success(response);
        },
        (error) => {
          
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }

    // download(file: File) {
    //     this.appHttpService.downloadFile(file);
    // }

    // deleteFiles(file: File) {
    //     this.messageService.questionDelete({})
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 const selectedFiles = [];
    //                 selectedFiles.push(file);

    //                 const ids = selectedFiles.map(element => element.id);
    //                 this.spinnerService.show();
    //                 this.appHttpService.delete('files/delete', ids)
    //                     .subscribe(response => {
    //                         this.spinnerService.hide();
    //                         this.messageService.success(response);
    //                         this.removeFiles(ids);
    //                         this.getFiles();
    //                     }, error => {
    //                         this.spinnerService.hide();
    //                         this.messageService.error(error);
    //                     });
    //             }
    //         });
    // }

    // removeDocuments(ids) {
    //     for (const id of ids) {
    //         this.files = this.files.filter(element => element.id !== id);
    //     }
    // }

    // verifyDocuments() {
    //     for (const document of this.documents) {
    //         this.catalogueDocuments = this.catalogueDocuments.filter(element => element.id !== document.type.id);
    //     }
    // }

    getSeverity(status) {
        switch (status) {
            case 'ACCEPTED':
                return 'success';
            case 'REJECTED':
                return 'error';
            case 'IN_REVISION':
                return 'info';
        }
        return 'warn';
    }

}
