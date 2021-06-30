import { Component, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { Event } from "src/app/models/uic/event";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
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
      name: [null, [Validators.required]],
      description: [null],
    });
  }

  getEvents(paginator: Paginator) {
    const params = new HttpParams()
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.flagEvents = true;
    this.uicHttpService.get("events", params).subscribe(
      (response) => {
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
