import { Requirement } from './../../../../models/uic/requirement';
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
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit {

  paginator: Paginator;
  requirements: Requirement[];
  formRequirement: FormGroup;
  requirement: Requirement;
  requirementDialog: boolean;
  flagRequirement: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page: 1, per_page: 5 };
    this.requirements = [];
   }

  ngOnInit(): void {
    this.buildFormRequirement();
    debugger
    this.getRequirements(this.paginator);
  }

  buildFormRequirement(){
    this.formRequirement = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      is_required: [null, [Validators.required]]

    });
  }
  getRequirements(paginator: Paginator){
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagRequirement = true;
    this.uicHttpService.get("requirements", params).subscribe(
      (response) => {
        this.flagRequirement = false;
        this.requirements = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagRequirement = false;
        this.messageService.error(error);
      }
    );

  }

}
