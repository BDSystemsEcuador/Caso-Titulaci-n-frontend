import { Validator } from './../../../../models/setting/validator';
import { Component, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators";

@Component({
  selector: "app-convocatory",
  templateUrl: "./convocatory.component.html",
  styleUrls: ["./convocatory.component.css"],
})
export class ConvocatoryComponent implements OnInit {
  paginator: Paginator;
  plannings: Planning[];//inicializar 
  planningsEnd: Planning[];
  formPlanning: FormGroup;
  planning: Planning;
  planningDialog: boolean;
  flagPlannings: boolean;
  disabledForm:boolean;
  
  constructor(
    private spinnerService: NgxSpinnerService,
    public messageService: MessageService,//siempre publico
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page: 1, per_page: 5 };
    this.plannings = [];
    this.planningsEnd = [];
  }

  ngOnInit(): void {
    this.buildFormPlanning();
    this.getPlannings(this.paginator);
    //this.getPlanningsEnd(this.paginator);//paginador por tabla
  }
  // Build form course
  buildFormPlanning() {
    this.formPlanning = this.formBuilder.group({
      id: [null],
      career: [null, [Validators.required]],
      name: [null, [Validators.required]],
      start_date: [null, [Validators.required, DateValidators.valid]],
      end_date: [null, [Validators.required, DateValidators.valid]],
      description: [null, []],
    });
  }

  getPlannings(paginator: Paginator) {
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagPlannings = true;
    this.uicHttpService.get("plannings", params).subscribe(
      (response) => {
        this.flagPlannings = false;
        this.plannings = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagPlannings = false;
        this.messageService.error(error);
      }
    );
  }
  getPlanningsEnd(paginator: Paginator) {
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagPlannings = true;
    this.uicHttpService.get("planning/end", params).subscribe(
      (response) => {
        this.flagPlannings = false;
        this.planningsEnd = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagPlannings = false;
        this.messageService.error(error);
      }
    );
  }
}