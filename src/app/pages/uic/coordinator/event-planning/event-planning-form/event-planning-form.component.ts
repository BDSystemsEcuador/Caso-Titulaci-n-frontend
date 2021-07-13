import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Event as EventModel } from 'src/app/models/uic/event';
import { EventPlanning } from 'src/app/models/uic/event-planning';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { AppHttpService } from 'src/app/services/app/app-http.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-event-planning-form',
  templateUrl: './event-planning-form.component.html',
  styleUrls: ['./event-planning-form.component.css']
})
export class EventPlanningFormComponent implements OnInit {
  @Input() formEventPlanningIn: FormGroup;
  @Input() eventPlanningsIn: EventPlanning[];
  @Input() paginatorIn: Paginator;

  @Output() displayOut = new EventEmitter<boolean>();
  @Output() eventPlanningsOut = new EventEmitter<EventPlanning[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  plannings: Planning[];
  events: any;
  selectedPlanning: Planning;
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
    return this.formEventPlanningIn.get('id');
  }
  get planningField() {
    return this.formEventPlanningIn.get('planning');
  }
  get eventField() {
    return this.formEventPlanningIn.get('event');
  }
  get startDateField() {
    return this.formEventPlanningIn.get('start_date');
  }
  get endDateField() {
    return this.formEventPlanningIn.get('end_date');
  }

 
  // Submit Form
  onSubmit(event: Event, flag = false) {
    debugger
    event.preventDefault();
    if (this.formEventPlanningIn.valid) {
      if (this.idField.value) {
        this.updateEventPlanning(this.formEventPlanningIn.value);
      } else {
        this.storeEventPlanning(this.formEventPlanningIn.value, flag);
        this.formEventPlanningIn.reset();
      }
    } else {
      this.formEventPlanningIn.markAllAsTouched();
    }
  }
  paginateEventPlanning(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  storeEventPlanning(eventPlanning: EventPlanning, flag = false) {
    this.spinnerService.show();
    this.uicHttpService.store('event-plannings', { eventPlanning }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveEventPlanning(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formEventPlanningIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveEventPlanning(eventPlanning: EventPlanning) {
    const index = this.eventPlanningsIn.findIndex(element => element.id === eventPlanning.id);
    if (index === -1) {
      this.eventPlanningsIn.push(eventPlanning);
    } else {
      this.eventPlanningsIn[index] = eventPlanning;
    }
    this.eventPlanningsOut.emit(this.eventPlanningsIn);
  }

  // Save in backend
  updateEventPlanning(eventPlanning: EventPlanning) {
    this.spinnerService.show();
    this.uicHttpService.update('event-plannings/' + eventPlanning.id, { eventPlanning })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveEventPlanning(response['data']);
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
    this.uicHttpService.get('events').subscribe(
      (response) => {
        this.events = response;
      },
      (error) => {
        this.messageService.error(error);
      }
    );
  }
}
