import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Event as EventModel } from 'src/app/models/uic/event';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { AppHttpService } from 'src/app/services/app/app-http.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  @Input() formEventIn: FormGroup;
  @Input() eventsIn: EventModel[];
  @Input() paginatorIn: Paginator;

  @Output() displayOut = new EventEmitter<boolean>();
  @Output() eventsOut = new EventEmitter<EventModel[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  plannings: Planning[];
  events: any;
  selectedPlanning: Planning;
  selectedPlan: Planning;
  selectedEvent: EventModel;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
    private appHttpService:AppHttpService
  ) { 
    this.getPlannings();
    this.getEvents();
  }
  ngOnInit(): void {
    
  }
  // Fields of Form
  get idField() {
    return this.formEventIn.get('id');
  }
  get planningField() {
    return this.formEventIn.get('planning');
  }
  get nameField() {
    return this.formEventIn.get('name');
  }
  get startDateField() {
    return this.formEventIn.get('start_date');
  }
  get endDateField() {
    return this.formEventIn.get('end_date');
  }

 
  // Submit Form
  onSubmit(event: Event, flag = false) {
    
    event.preventDefault();
    if (this.formEventIn.valid) {
      if (this.idField.value) {
        this.updateEvent(this.formEventIn.value);
      } else {
        this.storeEvent(this.formEventIn.value, flag);
      }
    } else {
      this.formEventIn.markAllAsTouched();
    }
  }
  paginateEvent(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  storeEvent(event: EventModel, flag = false) {
    
    this.spinnerService.show();
    this.uicHttpService.store('events', { event }).subscribe(response => {
      this.spinnerService.hide();
      
      this.messageService.success(response);
      this.saveEvent(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formEventIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveEvent(event: EventModel) {
    const index = this.eventsIn.findIndex(element => element.id === event.id);
    if (index === -1) {
      this.eventsIn.push(event);
    } else {
      this.eventsIn[index] = event;
    }
    this.eventsOut.emit(this.eventsIn);
  }

  // Save in backend
  updateEvent(event: EventModel) {
    this.spinnerService.show();
    this.uicHttpService.update('events/' + event.id, { event })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveEvent(response['data']);
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }
  getPlannings() {
    this.uicHttpService.get('plannings').subscribe(response => {
      this.plannings = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }

  getEvents() {
    this.appHttpService.getCatalogues('UIC.EVENTS.EVENT_TYPE').subscribe(
      (response) => {
        this.events = response['data'];
      },
      (error) => {
        this.messageService.error(error);
      }
    );
  }
}
