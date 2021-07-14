import { Catalogue } from './../../../../../models/app/catalogue';
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from "src/app/models/setting/paginator";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { AppHttpService } from "src/app/services/app/app-http.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
@Component({
  selector: "app-catalogue-event-form",
  templateUrl: "./catalogue-event-form.component.html",
  styleUrls: ["./catalogue-event-form.component.css"],
})
export class CatalogueEventFormComponent implements OnInit {
  @Input() formCatalogueEventIn: FormGroup;
  @Input() catalogueEventsIn: Catalogue[];
  @Input() paginatorIn: Paginator;
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() catalogueEventsOut = new EventEmitter<Catalogue[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
    private appHttpService: AppHttpService
  ) {
    
  }

  ngOnInit(): void {}
  // Fields of Form
  get nameField() {
    return this.formCatalogueEventIn.get("name");
  }
  get idField() {
    return this.formCatalogueEventIn.get("id");
  }

  // Submit Form
  onSubmit(event: Event, flag = false) {
   
    event.preventDefault();
    
    if (this.formCatalogueEventIn.valid) {
      if (this.idField.value) {
        
        this.updateCatalogueEvent(this.formCatalogueEventIn.value);
      } else {
        
        this.storeCatalogueEvent(this.formCatalogueEventIn.value, flag);
        this.formCatalogueEventIn.reset();
      }
    } else {
      this.formCatalogueEventIn.markAllAsTouched();
    }
  }
  paginateCatalogueEvent(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  
  storeCatalogueEvent(catalogueEvent: Catalogue, flag = false) {
    
    this.spinnerService.show();
    this.uicHttpService.store('catalogue-events', { catalogueEvent }).subscribe(response => {
      
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveCatalogueEvent(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formCatalogueEventIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveCatalogueEvent(catalogueEvent: Catalogue) {
    const index = this.catalogueEventsIn.findIndex((element) => element.id === catalogueEvent.id);
    if (index === -1) {
      this.catalogueEventsIn.push(catalogueEvent);
    } else {
      this.catalogueEventsIn[index] = catalogueEvent;
    }
    this.catalogueEventsOut.emit(this.catalogueEventsIn);
  }

  // Save in backend
  updateCatalogueEvent(catalogueEvent: Catalogue) {
    this.spinnerService.show();
    this.uicHttpService.update("catalogue-events/" + catalogueEvent.id, { catalogueEvent }).subscribe(
      (response) => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveCatalogueEvent(response["data"]);
        this.displayOut.emit(false);
      },
      (error) => {
        this.spinnerService.hide();
        this.messageService.error(error);
      }
    );
  }
}
