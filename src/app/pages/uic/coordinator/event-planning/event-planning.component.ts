import { Component, OnInit } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators"
import { EventPlanning } from 'src/app/models/uic/event-planning';

@Component({
  selector: 'app-event-planning',
  templateUrl: './event-planning.component.html',
  styleUrls: ['./event-planning.component.css']
})
export class EventPlanningComponent implements OnInit {
  paginator: Paginator;
  eventPlannings: EventPlanning[];
  formEventPlanning: FormGroup;
  eventPlanning: EventPlanning;
  eventPlanningDialog: boolean;
  flagEventPlannings: boolean;
  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page: 1, per_page: 5 };
    this.eventPlannings = [];
  }

  ngOnInit(): void {
    this.buildFormEventPlanning();
    this.getEventPlannings(this.paginator);
  }
  // Build form course
  buildFormEventPlanning() {
    this.formEventPlanning = this.formBuilder.group({
      id: [null],
      planning: [null, [Validators.required]],//fk sin _id
      event: [null, [Validators.required]],
      start_date: [null, [Validators.required, DateValidators.valid]],
      end_date: [null, [Validators.required, DateValidators.valid]],
      observations: this.formBuilder.array([this.formBuilder.control(null)]),
    });
  }
  getEventPlannings(paginator: Paginator) {
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagEventPlannings = true;
    this.uicHttpService.get("event-plannings", params).subscribe(
      (response) => {
        console.log(response["data"]);
        this.flagEventPlannings = false;
        this.eventPlannings = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagEventPlannings = false;
        this.messageService.error(error);
      }
    );
  }
}
