import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { EventPlanning } from "src/app/models/uic/event-planning";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-event-planning-list',
  templateUrl: './event-planning-list.component.html',
  styleUrls: ['./event-planning-list.component.css']
})
export class EventPlanningListComponent implements OnInit {
  @Input() flagEventPlannings: boolean;
  @Input() eventPlanningsIn: EventPlanning[];
  @Input() eventPlanningsEndIn: EventPlanning[];
  @Input() paginatorIn: Paginator;
  @Input() formEventPlanningIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() eventPlanningsOut = new EventEmitter<EventPlanning[]>();
  @Output() eventPlanningsEndOut = new EventEmitter<EventPlanning[]>();
  @Output() formEventPlanningOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsEventPlanning: Col[];
  selectedEventPlannings: any[];
  dialogUploadFiles: boolean;
  selectedEventPlanning: EventPlanning;
  paginatorFiles: Paginator;
  files: File[];
  dialogViewFiles: boolean;
  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) {
    this.resetPaginatorEventPlannings();
    this.resetPaginator();
    console.log(this.currentDate);
  }

  resetPaginator() {
    this.paginatorFiles = { current_page: 1, per_page: 10 };
  }

  ngOnInit(): void {
    this.loadColsEventPlanning();
  }
  loadColsEventPlanning() {
    this.colsEventPlanning = [
      { field: "planning", header: "Convocatoria" },
      { field: "event", header: "Evento" },
      { field: "start_date", header: "Fecha de inicio" },
      { field: "end_date", header: "Fecha de fin" },
      { field: "observations", header: "Observaciones" },
    ];
  }

  openNewFormEventPlanning() {
    this.formEventPlanningIn.reset();
    this.formEventPlanningOut.emit(this.formEventPlanningIn);
    this.displayOut.emit(true);
  }

  openEditFormEventPlanning(eventPlanning: EventPlanning) {
    this.formEventPlanningIn.patchValue(eventPlanning);
    this.formEventPlanningOut.emit(this.formEventPlanningIn);
    this.displayOut.emit(true);
  }

  paginateEventPlanning(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorEventPlannings() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deleteEventPlanning(eventPlanning: EventPlanning) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService
          .delete("event-planning/delete", { ids: eventPlanning.id })
          .subscribe(
            (response) => {
              this.spinnerService.hide();
              this.messageService.success(response);
              this.removeEventPlanning(eventPlanning);
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
  removeEventPlanning(eventPlanning: EventPlanning) {
    this.eventPlanningsIn = this.eventPlanningsIn.filter(
      (element) => element !== eventPlanning
    );
    this.eventPlanningsOut.emit(this.eventPlanningsIn);
  }

  deleteEventPlannings(eventPlanning = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        if (eventPlanning) {
          this.selectedEventPlannings = [];
          this.selectedEventPlannings.push(eventPlanning);
        }
        const ids = this.selectedEventPlannings.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("event-planning/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeEventPlannings(ids);
            this.selectedEventPlannings = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchEventPlannings(event, search) {
    if (event.type === "click" || event.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("event-plannings", params).subscribe(
        (response) => {
          (this.eventPlanningsIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removeEventPlannings(ids) {
    for (const id of ids) {
      this.eventPlanningsIn = this.eventPlanningsIn.filter(
        (element) => element.id !== id
      );
    }
    this.eventPlanningsOut.emit(this.eventPlanningsIn);
  }

  //upload files
  openUploadFilesEventPlanning() {
    this.dialogUploadFiles = true;
  }
  selectEventPlanning(eventPlanning: EventPlanning) {
    this.selectedEventPlanning = eventPlanning;
  }

  openViewFilesEventPlanning() {
    this.getFiles(this.paginatorFiles);
  }
  getFiles(paginator: Paginator) {
    debugger;
    const params = new HttpParams()
      .append("id", this.selectedEventPlanning.id.toString())
      .append("page", paginator.current_page.toString())
      .append("per_page", paginator.per_page.toString());
    this.spinnerService.show();
    this.uicHttpService.getFiles("event-planning/file", params).subscribe(
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
    this.uicHttpService.uploadFiles("event-planning/file", formData).subscribe(
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
      this.selectedEventPlanning.id.toString()
    );
    params = search.length > 0 ? params.append("search", search) : params;
    this.spinnerService.show();
    this.uicHttpService.get("event-planning/file", params).subscribe(
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
