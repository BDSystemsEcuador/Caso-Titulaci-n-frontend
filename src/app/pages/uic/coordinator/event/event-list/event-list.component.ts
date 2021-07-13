import { HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Catalogue } from "src/app/models/app/catalogue";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { Event } from "src/app/models/uic/event";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";

@Component({
  selector: "app-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.css"],
})
export class EventListComponent implements OnInit {
  @Input() flagEvents: boolean;
  @Input() eventsIn: Catalogue[];
  @Input() eventsEndIn: Catalogue[];
  @Input() paginatorIn: Paginator;
  @Input() formEventIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() eventsOut = new EventEmitter<Catalogue[]>();
  @Output() eventsEndOut = new EventEmitter<Catalogue[]>();
  @Output() formEventOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsEvent: Col[];
  selectedEvents: any[];
  dialogUploadFiles: boolean;
  selectedEvent: Catalogue;
  paginatorFiles: Paginator;
  files: File[];
  dialogViewFiles: boolean;
  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) {
    this.resetPaginatorEvents();
    this.resetPaginator();
    console.log(this.currentDate);
  }

  resetPaginator() {
    this.paginatorFiles = { current_page: 1, per_page: 10 };
  }

  ngOnInit(): void {
    this.loadColsEvent();
  }
  loadColsEvent() {
    this.colsEvent = [
      { field: "name", header: "Evento" }
    ];
  }

  openNewFormEvent() {
    this.formEventIn.reset();
    this.formEventOut.emit(this.formEventIn);
    this.displayOut.emit(true);
  }

  openEditFormEvent(event: Catalogue) {
    this.formEventIn.patchValue(event);
    this.formEventOut.emit(this.formEventIn);
    this.displayOut.emit(true);
  }

  paginateEvent(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorEvents() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deleteEvent(event: Catalogue) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService.delete("event/delete", { ids: event.id }).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeEvent(event);
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
  removeEvent(event: Catalogue) {
    this.eventsIn = this.eventsIn.filter((element) => element !== event);
    this.eventsOut.emit(this.eventsIn);
  }

  deleteEvents(event = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        debugger;
        if (event) {
          this.selectedEvents = [];
          this.selectedEvents.push(event);
        }
        const ids = this.selectedEvents.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("event/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeEvents(ids);
            this.selectedEvents = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchEvents(event, search) {
    if (event.type === "click" || event.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("events", params).subscribe(
        (response) => {
          (this.eventsIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removeEvents(ids) {
    for (const id of ids) {
      this.eventsIn = this.eventsIn.filter((element) => element.id !== id);
    }
    this.eventsOut.emit(this.eventsIn);
  }
}
