import { MeshStudentRequirement } from './../../../../models/uic/mesh-student-requirement';
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
import {File} from '../../../../models/app/file';
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
  requirements: Requirement[];
  studentRequirements: MeshStudentRequirement[] = [];

  constructor(private appHttpService: AppHttpService,
              private authService: AuthService,
              public messageService: MessageService,
              private spinnerService: NgxSpinnerService,
              private breadcrumbService: BreadcrumbService,
              private uicHttpService: UicHttpService) {

      
  }

  ngOnInit() {
      this.getRequirements();
  }

  async getRequirements(){

    let result = await this.uicHttpService.get("requirements").toPromise();
          this.requirements = result["data"];

          result = await this.uicHttpService.get("mesh-student-requirements").toPromise();

      this.studentRequirements = await result['data'];
      
      this.verifyDocuments();
  
    }

  download(file: File) {
    
    const params = new HttpParams().append('full_path', file.full_path);
    this.appHttpService.downloadFiles(params).subscribe(response => {
        const binaryData = [];
        binaryData.push(response);
        const filePath = URL.createObjectURL(new Blob(binaryData, {type: response['type']}));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', file.full_name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }, error => {
        this.messageService.error(error);
    });
}

  storeRequirement(event, meshStudentRequirement: MeshStudentRequirement) {
    
    this.uicHttpService.store('mesh-student-requirements', { meshStudentRequirement }).subscribe(response => {
      this.upload(event, response['data'].id);
      this.getRequirements();
      this.messageService.success(response);
    }, error => {
      this.messageService.error(error);
    });
  }

  upload(event, id) {
    
    const formData = new FormData();
    for (const file of event) {
      formData.append("files[]", file);
    }
    formData.append("id", id.toString());
    this.spinnerService.show();
    this.uicHttpService.uploadFiles("mesh-student-requirement/file", formData).subscribe(
      (response) => {
        
        this.spinnerService.hide();
        this.messageService.success(response);

        this.verifyDocuments();
      },
      (error) => {
        
        this.spinnerService.hide();
        this.messageService.error(error);
      }
    );
  }

  deleteDocuments(document: MeshStudentRequirement) {
    this.messageService.questionDelete({})
        .then((result) => {
            if (result.isConfirmed) {
                const selectedDocuments = [];
                selectedDocuments.push(document);

                const ids = selectedDocuments.map(element => element.id);
                this.spinnerService.show();
                this.uicHttpService.delete('mesh-student-requirement/delete', ids)
                    .subscribe(response => {
                        this.spinnerService.hide();
                        this.messageService.success(response);
                        this.removeDocuments(ids);
                        this.getRequirements();
                    }, error => {
                        this.spinnerService.hide();
                        this.messageService.error(error);
                    });
            }
        });
}

removeDocuments(ids) {
  for (const id of ids) {
      this.studentRequirements = this.studentRequirements.filter(element => element.id !== id);
  }
}

verifyDocuments() {
  for (const studentRequirement of this.studentRequirements) {
      this.requirements = this.requirements.filter(element => element.id !== studentRequirement.requirement.id);
  }
}

}
