import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Col } from 'src/app/models/setting/col';
import { Paginator } from 'src/app/models/setting/paginator';
import { Requirement } from 'src/app/models/uic/requirement';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-requirements-list',
  templateUrl: './requirements-list.component.html',
  styleUrls: ['./requirements-list.component.css']
})
export class RequirementsListComponent implements OnInit {
  @Input() flagRequirements: boolean;
  @Input() requirementsIn: Requirement[];
  @Input() paginatorIn: Paginator;
  @Input() formRequirementIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() requirementsOut = new EventEmitter<Requirement[]>();
  @Output() formRequirementOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsRequirement: Col[];
  selectedRequirements: any[];
  selectedRequirement: Requirement;
  dialogUploadFiles: boolean;
  dialogViewFiles: boolean;
  files: File[];
  paginatorFiles: Paginator;
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) { 
    this.resetPaginatorRequirements();
    this.resetPaginator();
  }
  resetPaginator() {
    this.paginatorFiles = {current_page: 1, per_page: 5};
}
  ngOnInit(): void {
    this.loadColsRequirement();
  }

  loadColsRequirement() {
    this.colsRequirement = [
        {field: 'id', header: 'Id'},
        {field: 'name', header: 'Nombre'},
        {field: 'is_required', header: 'Es requerido'}
    ];
  }

    openNewFormRequirement() {
        this.formRequirementIn.reset();
        this.formRequirementOut.emit(this.formRequirementIn);
        this.displayOut.emit(true);
    }

    openEditFormRequirement(requirement: Requirement) {
        this.formRequirementIn.patchValue(requirement);
        this.formRequirementOut.emit(this.formRequirementIn);
        this.displayOut.emit(true);
    }

    paginateRequirement(event) {
        this.paginatorIn.current_page = event.page + 1;
        this.paginatorOut.emit(this.paginatorIn);
    }

    resetPaginatorRequirements() {
        this.paginatorIn = {current_page: 1, per_page: 5};
    }

    deleteRequirement(requirement: Requirement) {
        this.messageService.questionDelete({})
            .then((result) => {
                if (result.isConfirmed) {
                    this.spinnerService.show();
                    this.uicHttpService.delete('requirement/delete', {ids: requirement.id})
                        .subscribe(response => {
                            this.spinnerService.hide();
                            this.messageService.success(response);
                            this.removeRequirement(requirement);
                        }, error => {
                            this.spinnerService.hide();
                            this.messageService.error(error);
                        });
                }
            });
    }

    // no se utiliza VERIFICAR DDE NUEVO
    removeRequirement(requirement: Requirement) {
        this.requirementsIn = this.requirementsIn.filter(element => element !== requirement);
        this.requirementsOut.emit(this.requirementsIn);
    }

    deleteRequirements(requirement = null) {
      this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {  
          if (requirement) {
            this.selectedRequirements = [];
            this.selectedRequirements.push(requirement);
          }
          const ids = this.selectedRequirements.map(element => element.id);
          this.spinnerService.show();
                    this.uicHttpService.delete('requirement/delete', ids)
                        .subscribe(response => {
                            this.spinnerService.hide();
                            this.messageService.success(response);
                            this.removeRequirements(ids);
                            this.selectedRequirements = [];
                        }, error => {
                            this.spinnerService.hide();
                            this.messageService.error(error);
                        });
                }
            });

    }
    searchRequirements(event, search) {
      if (event.type === 'click' || event.keyCode === 13 || search.length === 0) {
          const params = search.length > 0 ? new HttpParams().append('search', search) : null;
          this.spinnerService.show();
          this.uicHttpService.get('requirements', params).subscribe(response => {
              this.requirementsIn = response['data'],
                  this.spinnerService.hide();
          }, error => {
              this.spinnerService.hide();
              this.messageService.error(error);
          });
      }
  }
    // no se utiliza
    removeRequirements(ids) {
        for (const id of ids) {
            this.requirementsIn = this.requirementsIn.filter(element => element.id !== id);
        }
        this.requirementsOut.emit(this.requirementsIn);
    }
    openUploadFilesRequirement() {
        this.dialogUploadFiles = true;
    }
    selectRequirement(requirement: Requirement) {
       
        this.selectedRequirement = requirement;
    }

    openViewFilesRequirement() {
        this.getFiles(this.paginatorFiles);
    }
    getFiles(paginator: Paginator) {
        const params = new HttpParams()
            .append('id', this.selectedRequirement.id.toString())
            .append('page', paginator.current_page.toString())
            .append('per_page', paginator.per_page.toString());
        this.spinnerService.show();
        this.uicHttpService.getFiles('requirement/file', params).subscribe(response => {
            this.spinnerService.hide();
            this.files = response['data'];
            this.paginatorFiles = response as Paginator;
            this.dialogViewFiles = true;
        }, error => {
            this.spinnerService.hide();
            this.files = [];
            this.dialogViewFiles = true;
            this.messageService.error(error);
        });
    }
    pageChange(event) {
        this.paginatorIn.current_page = event.page + 1;
        this.paginatorOut.emit(this.paginatorIn);
    }
    upload(event, id) {
        console.log(event);
        const formData = new FormData();
        for (const file of event) {
            formData.append('files[]', file);
        }
        formData.append('id', id.toString());
        this.spinnerService.show();
        this.uicHttpService.uploadFiles('requirement/file', formData).subscribe(response => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.getFiles(this.paginatorFiles);
        }, error => {
            this.spinnerService.hide();
            this.messageService.error(error);
        });
    }
    searchFiles(search) {
        let params = new HttpParams().append('id', this.selectedRequirement.id.toString());
        params = search.length > 0 ? params.append('search', search) : params;
        this.spinnerService.show();
        this.uicHttpService.get('requirement/file', params).subscribe(response => {
            this.files = response['data'];
            this.spinnerService.hide();
        }, error => {
            this.spinnerService.hide();
            this.messageService.error(error);
        });
    }
}
