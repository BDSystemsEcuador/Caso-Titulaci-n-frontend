import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { ProjectPlan } from "src/app/models/uic/project-plan";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-project-plan-list',
  templateUrl: './project-plan-list.component.html',
  styleUrls: ['./project-plan-list.component.css']
})
export class ProjectPlanListComponent implements OnInit {
  @Input() flagProjectPlans: boolean;
  @Input() projectPlansIn: ProjectPlan[];
  @Input() projectPlansEndIn: ProjectPlan[];
  @Input() paginatorIn: Paginator;
  @Input() formProjectPlanIn: FormGroup;
  @Input() displayIn: boolean;


  @Output() projectPlansOut = new EventEmitter<ProjectPlan[]>();
  @Output() projectPlansEndOut = new EventEmitter<ProjectPlan[]>();
  @Output() formProjectPlanOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsProjectPlan: Col[];
  selectedProjectPlans: any[];
  dialogUploadFiles: boolean;
  selectedProjectPlan: ProjectPlan;
  paginatorFiles: Paginator;
  files: File[];
  dialogViewFiles: boolean;
  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) {
    this.resetPaginatorProjectPlans();
    this.resetPaginator();
    console.log(this.currentDate);
  }

  resetPaginator() {
    this.paginatorFiles = { current_page: 1, per_page: 10 };
  }

  ngOnInit(): void {
    this.loadColsProjectPlan();
  }
  loadColsProjectPlan() {
    this.colsProjectPlan = [
      { field: "title", header: "Título" },
      { field: "description", header: "Descripción" },
      { field: "act_code", header: "Código de acta" },
      { field: "approval_date", header: "Fecha de aprobación" },
      { field: "is_approved", header: "Esta aprobado" },
      { field: "observations", header: "Observaciones"}
    ];
  }

  openNewFormProjectPlan() {
    this.formProjectPlanIn.reset();
    this.formProjectPlanOut.emit(this.formProjectPlanIn);
    this.displayOut.emit(true);
  }

  openEditFormProjectPlan(projectPlan: ProjectPlan) {
    this.formProjectPlanIn.patchValue(projectPlan);
    this.formProjectPlanOut.emit(this.formProjectPlanIn);
    this.displayOut.emit(true);
  }

  paginateProjectPlan(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorProjectPlans() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deleteProjectPlan(projectPlan: ProjectPlan) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService
          .delete("project-plan/delete", { ids: projectPlan.id })
          .subscribe(
            (response) => {
              this.spinnerService.hide();
              this.messageService.success(response);
              this.removeProjectPlan(projectPlan);
            },
            (error) => {
              this.spinnerService.hide();
              this.messageService.error(error);
            }
          );
      }
    });
  }

  // no se utiliza VERIFICAR DDE NUEVO
  removeProjectPlan(projectPlan: ProjectPlan) {
    this.projectPlansIn = this.projectPlansIn.filter(
      (element) => element !== projectPlan
    );
    this.projectPlansOut.emit(this.projectPlansIn);
  }

  deleteProjectPlans(projectPlan = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        if (projectPlan) {
          this.selectedProjectPlans = [];
          this.selectedProjectPlans.push(projectPlan);
        }
        const ids = this.selectedProjectPlans.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("project-plan/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeProjectPlans(ids);
            this.selectedProjectPlans = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchProjectPlans(event, search) {
    if (event.type === "click" || event.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("project-plans", params).subscribe(
        (response) => {
          (this.projectPlansIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removeProjectPlans(ids) {
    for (const id of ids) {
      this.projectPlansIn = this.projectPlansIn.filter(
        (element) => element.id !== id
      );
    }
    this.projectPlansOut.emit(this.projectPlansIn);
  }

  //upload files
  openUploadFilesProjectPlan() {
    this.dialogUploadFiles = true;
  }
  selectProjectPlan(projectPlan: ProjectPlan) {
    this.selectedProjectPlan = projectPlan;
  }

  openViewFilesProjectPlan() {
    this.getFiles(this.paginatorFiles);
  }
  getFiles(paginator: Paginator) {
    debugger;
    const params = new HttpParams()
      .append("id", this.selectedProjectPlan.id.toString())
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.spinnerService.show();
    this.uicHttpService.getFiles("project-plan/file", params).subscribe(
      (response) => {
        this.spinnerService.hide();
        this.files = response["data"];
        this.paginatorFiles = response as Paginator;
        this.dialogViewFiles = true;
      },
      (error) => {
        this.spinnerService.hide();
        this.files = [];
        this.dialogViewFiles = true;
        this.messageService.error(error);
      }
    );
  }
  pageChange(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  upload(event, id) {
    console.log(event);
    const formData = new FormData();
    for (const file of event) {
      formData.append("files[]", file);
    }
    formData.append("id", id.toString());
    this.spinnerService.show();
    this.uicHttpService.uploadFiles("project-plan/file", formData).subscribe(
      (response) => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.getFiles(this.paginatorFiles);
      },
      (error) => {
        this.spinnerService.hide();
        this.messageService.error(error);
      }
    );
  }
  searchFiles(search) {
    let params = new HttpParams().append(
      "id",
      this.selectedProjectPlan.id.toString()
    );
    params = search.length > 0 ? params.append("search", search) : params;
    this.spinnerService.show();
    this.uicHttpService.get("project-plan/file", params).subscribe(
      (response) => {
        this.files = response["data"];
        this.spinnerService.hide();
      },
      (error) => {
        this.spinnerService.hide();
        this.messageService.error(error);
      }
    );
  }
}
