import { ProjectPlan } from './../../../../models/uic/project-plan';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators";

@Component({
  selector: 'app-project-plan',
  templateUrl: './project-plan.component.html',
  styleUrls: ['./project-plan.component.css']
})
export class ProjectPlanComponent implements OnInit {

  paginator: Paginator;
  projectPlans: ProjectPlan[];
  formProjectPlan: FormGroup;
  projectPlan: ProjectPlan;
  projectPlanDialog: boolean;
  flagProjectPlan: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page: 1, per_page: 5 };
    this.projectPlans = [];
   }

  ngOnInit(): void {
    this.buildFormProjectPlan();
    this.getProjectPlans(this.paginator);
  }

  buildFormProjectPlan(){
    this.formProjectPlan = this.formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      act_code: [null, [Validators.required]],
      approval_date: [null, [Validators.required]],
      is_approved: [null, [Validators.required]],
      observations: this.formBuilder.array([this.formBuilder.control(null)])

    });
  }
  getProjectPlans(paginator: Paginator){
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagProjectPlan = true;
    this.uicHttpService.get("project-plans", params).subscribe(
      (response) => {
        this.flagProjectPlan = false;
        this.projectPlans = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagProjectPlan = false;
        this.messageService.error(error);
      }
    );

  }
}
