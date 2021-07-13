import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { Event } from "src/app/models/uic/event";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @Input() flagEvents: boolean;
  @Input() eventsIn: Event[];
  @Input() eventsEndIn: Event[];
  @Input() paginatorIn: Paginator;
  @Input() formEventIn: FormGroup;
  @Input() displayIn: boolean;


  @Output() eventsOut = new EventEmitter<Event[]>();
  @Output() eventsEndOut = new EventEmitter<Event[]>();
  @Output() formEventOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsEvent: Col[];
  selectedEvents: any[];
  dialogUploadFiles: boolean;
  selectedEvent: Event;
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
      { field: "planning", header: "Convocatoria" },
      { field: "name", header: "Evento" },
      { field: "start_date", header: "Fecha de inicio" },
      { field: "end_date", header: "Fecha de fin" }
    ];
  }

  openNewFormEvent() {
  
    this.formEventIn.reset();
    this.formEventOut.emit(this.formEventIn);
    this.displayOut.emit(true);
  }

  openEditFormEvent(event: Event) {
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

  deleteEvent(event: Event) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService
          .delete("event/delete", { ids: event.id })
          .subscribe(
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
  removeEvent(event: Event) {
    this.eventsIn = this.eventsIn.filter(
      (element) => element !== event
    );
    this.eventsOut.emit(this.eventsIn);
  }

  deleteEvents(event = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
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
      this.eventsIn = this.eventsIn.filter(
        (element) => element.id !== id
      );
    }
    this.eventsOut.emit(this.eventsIn);
  }

  //upload files
  openUploadFilesEvent() {
    this.dialogUploadFiles = true;
  }
  selectEvent(event: Event) {
    this.selectedEvent = event;
  }

  openViewFilesEvent() {
    this.getFiles(this.paginatorFiles);
  }
  getFiles(paginator: Paginator) {
    ;
    const params = new HttpParams()
      .append("id", this.selectedEvent.id.toString())
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.spinnerService.show();
    this.uicHttpService.getFiles("event/file", params).subscribe(
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
    this.uicHttpService.uploadFiles("event/file", formData).subscribe(
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
      this.selectedEvent.id.toString()
    );
    params = search.length > 0 ? params.append("search", search) : params;
    this.spinnerService.show();
    this.uicHttpService.get("event/file", params).subscribe(
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
