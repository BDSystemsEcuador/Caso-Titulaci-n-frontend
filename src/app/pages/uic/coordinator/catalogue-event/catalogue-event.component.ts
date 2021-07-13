import { Component, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { MessageService } from "../../../shared/services/message.service";
import { DateValidators } from "../../../shared/validators/date.validators";
import { AppHttpService } from "src/app/services/app/app-http.service";
import { Catalogue } from "src/app/models/app/catalogue";

@Component({
  selector: "app-catalogue-event",
  templateUrl: "./catalogue-event.component.html",
  styleUrls: ["./catalogue-event.component.css"],
})
export class CatalogueEventComponent implements OnInit {
  catalogueEvents: any;
  formCatalogueEvent: FormGroup;
  catalogueEvent: Catalogue;
  catalogueEventDialog: boolean;
  flagCatalogueEvents: boolean;
  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService,
    private appHttpService:AppHttpService
  ) {
  }

  ngOnInit(): void {
    this.buildFormCatalogueEvent();
    this.getCatalogueEvents();
  }
  // Build form course
  buildFormCatalogueEvent() {
    this.formCatalogueEvent = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
    });
  }

  getCatalogueEvents() {
    this.appHttpService.getCatalogues('UIC.EVENTS.EVENT_TYPE').subscribe(
      (response) => {
        this.catalogueEvents = response['data'];
      },
      (error) => {
        this.messageService.error(error);
      }
    );
  }
}
