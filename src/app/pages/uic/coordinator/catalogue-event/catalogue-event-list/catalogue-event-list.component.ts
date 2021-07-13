import { HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Catalogue } from "src/app/models/app/catalogue";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";

@Component({
  selector: "app-catalogue-event-list",
  templateUrl: "./catalogue-event-list.component.html",
  styleUrls: ["./catalogue-event-list.component.css"],
})
export class CatalogueEventListComponent implements OnInit {
  @Input() flagCatalogueEvents: boolean;
  @Input() catalogueEventsIn: Catalogue[];
  @Input() catalogueEventsEndIn: Catalogue[];
  @Input() paginatorIn: Paginator;
  @Input() formCatalogueEventIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() catalogueEventsOut = new EventEmitter<Catalogue[]>();
  @Output() catalogueEventsEndOut = new EventEmitter<Catalogue[]>();
  @Output() formCatalogueEventOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  colsCatalogueEvent: Col[];
  selectedCatalogueEvents: any[];
  dialogUploadFiles: boolean;
  selectedCatalogueEvent: Catalogue;
  paginatorFiles: Paginator;
  files: File[];
  dialogViewFiles: boolean;
  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService
  ) {
    this.resetPaginatorCatalogueEvents();
    this.resetPaginator();
    console.log(this.currentDate);
  }

  resetPaginator() {
    this.paginatorFiles = { current_page: 1, per_page: 10 };
  }

  ngOnInit(): void {
    this.loadColsCatalogueEvent();
  }
  loadColsCatalogueEvent() {
    this.colsCatalogueEvent = [
      { field: "name", header: "Evento" }
    ];
  }

  openNewFormCatalogueEvent() {
    this.formCatalogueEventIn.reset();
    this.formCatalogueEventOut.emit(this.formCatalogueEventIn);
    this.displayOut.emit(true);
  }

  openEditFormCatalogueEvent(catalogueEvent: Catalogue) {
    this.formCatalogueEventIn.patchValue(catalogueEvent);
    this.formCatalogueEventOut.emit(this.formCatalogueEventIn);
    this.displayOut.emit(true);
  }

  paginateCatalogueEvent(catalogueEvent) {
    this.paginatorIn.current_page = catalogueEvent.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorCatalogueEvents() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deleteCatalogueEvent(catalogueEvent: Catalogue) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService.delete("catalogue-event/delete", { ids: catalogueEvent.id }).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeCatalogueEvent(catalogueEvent);
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
  removeCatalogueEvent(catalogueEvent: Catalogue) {
    this.catalogueEventsIn = this.catalogueEventsIn.filter((element) => element !== catalogueEvent);
    this.catalogueEventsOut.emit(this.catalogueEventsIn);
  }

  deleteCatalogueEvents(catalogueEvent = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        ;
        if (catalogueEvent) {
          this.selectedCatalogueEvents = [];
          this.selectedCatalogueEvents.push(catalogueEvent);
        }
        const ids = this.selectedCatalogueEvents.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("catalogue-event/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeCatalogueEvents(ids);
            this.selectedCatalogueEvents = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchCatalogueEvents(catalogueEvent, search) {
    if (catalogueEvent.type === "click" || catalogueEvent.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("catalogue-events", params).subscribe(
        (response) => {
          (this.catalogueEventsIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removeCatalogueEvents(ids) {
    for (const id of ids) {
      this.catalogueEventsIn = this.catalogueEventsIn.filter((element) => element.id !== id);
    }
    this.catalogueEventsOut.emit(this.catalogueEventsIn);
  }
}
