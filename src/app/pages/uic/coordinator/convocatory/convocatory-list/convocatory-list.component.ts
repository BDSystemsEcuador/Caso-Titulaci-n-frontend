import { HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";

@Component({
  selector: "app-convocatory-list",
  templateUrl: "./convocatory-list.component.html",
  styleUrls: ["./convocatory-list.component.css"],
})
export class ConvocatoryListComponent implements OnInit {
  @Input() flagPlannings: boolean;
  @Input() planningsIn: Planning[];
  @Input() planningsEndIn: Planning[];
  @Input() paginatorIn: Paginator;
  @Input() formPlanningIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() planningsOut = new EventEmitter<Planning[]>();
  @Output() planningsEndOut = new EventEmitter<Planning[]>();
  @Output() formPlanningOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  @Output() disabledFormOut = new EventEmitter<boolean>();
  colsPlanning: Col[];
  selectedPlannings: any[];

  selectedPlanning: Planning;

  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) {
    this.resetPaginatorPlannings();

    console.log(this.currentDate);
  }


  ngOnInit(): void {
    this.loadColsPlanning();
  }
  loadColsPlanning() {
    this.colsPlanning = [
      { field: "career", header: "Carrera" },
      { field: "name", header: "Convocatoria" },
      { field: "description", header: "Descripción" },
      { field: "start_date", header: "Fecha Inicial" },
      { field: "end_date", header: "Fecha Final" },
    ];
  }

  openNewFormPlanning() {
    this.formPlanningIn.reset();
    this.formPlanningOut.emit(this.formPlanningIn);
    this.displayOut.emit(true);
    this.disabledFormOut.emit(false);
  }

  openEditFormPlanning(planning: Planning) {
    this.formPlanningIn.patchValue(planning);
    this.formPlanningOut.emit(this.formPlanningIn);
    this.displayOut.emit(true);
    this.disabledFormOut.emit(true);
  }

  paginatePlanning(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorPlannings() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deletePlanning(planning: Planning) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService
          .delete("planning/delete", { ids: planning.id })
          .subscribe(
            (response) => {
              this.spinnerService.hide();
              this.messageService.success(response);
              this.removePlanning(planning);
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
  removePlanning(planning: Planning) {
    this.planningsIn = this.planningsIn.filter(
      (element) => element !== planning
    );
    this.planningsOut.emit(this.planningsIn);
  }

  deletePlannings(planning = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        ;
        if (planning) {
          this.selectedPlannings = [];
          this.selectedPlannings.push(planning);
        }
        const ids = this.selectedPlannings.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("planning/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removePlannings(ids);
            this.selectedPlannings = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchPlannings(event, search) {
    if (event.type === "click" || event.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("plannings", params).subscribe(
        (response) => {
          (this.planningsIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removePlannings(ids) {
    for (const id of ids) {
      this.planningsIn = this.planningsIn.filter(
        (element) => element.id !== id
      );
    }
    this.planningsOut.emit(this.planningsIn);
  }


  selectPlanning(planning: Planning) {
    this.selectedPlanning = planning;
  }

  pageChange(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  
}
