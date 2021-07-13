import { Component, OnInit } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Planning } from "src/app/models/uic/planning";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators"
import { Event } from 'src/app/models/uic/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  paginator: Paginator;
  events: Event[];
  formEvent: FormGroup;
  event: Event;
  eventDialog: boolean;
  flagEvents: boolean;
  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page: 1, per_page: 5 };
    this.events = [];
  }

  ngOnInit(): void {
    this.buildFormEvent();
    this.getEvents(this.paginator);
  }
  // Build form course
  buildFormEvent() {
    this.formEvent = this.formBuilder.group({
      id: [null],
      planning: [null, [Validators.required]],//fk sin _id
      name: [null, [Validators.required]],
      start_date: [null, [Validators.required, DateValidators.valid]],
      end_date: [null, [Validators.required, DateValidators.valid]],
    });
  }
  getEvents(paginator: Paginator) {
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagEvents = true;
    this.uicHttpService.get("events", params).subscribe(
      (response) => {
        console.log(response["data"]);
        
        this.flagEvents = false;
        this.events = response["data"];
        this.paginator = response as Paginator;
      },
      (error) => {
        this.flagEvents = false;
        this.messageService.error(error);
      }
    );
  }
}
