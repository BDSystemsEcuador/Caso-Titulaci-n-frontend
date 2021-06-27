import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-convocatory-form',
  templateUrl: './convocatory-form.component.html',
  styleUrls: ['./convocatory-form.component.css']
})
export class ConvocatoryFormComponent implements OnInit {
  @Input() formPlanningIn: FormGroup;
  @Input() planningsIn: Planning[];
  @Input() paginatorIn: Paginator;
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() planningsOut = new EventEmitter<Planning[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  constructor(
    private formBuilder:FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
  ){ }

  ngOnInit(): void {

  }
// Fields of Form
get nameField() {
  return this.formPlanningIn.get('name');
}
get numberField() {
  return this.formPlanningIn.get('number');
}
get eventField() {
  return this.formPlanningIn.get('event');
}
get startDateField() {
  return this.formPlanningIn.get('start_date');
}
get endDateField() {
  return this.formPlanningIn.get('end_date');
}
get descriptionField() {
  return this.formPlanningIn.get('description');
}
get idField() {
  return this.formPlanningIn.get('id');
}

// Submit Form
onSubmit(event: Event, flag = false) {
  event.preventDefault();
  if (this.formPlanningIn.valid) {
      if (this.idField.value) {
          this.updatePlanning(this.formPlanningIn.value);
      } else {
          this.storePlanning(this.formPlanningIn.value, flag);
          this.formPlanningIn.reset();
      }
  } else {
      this.formPlanningIn.markAllAsTouched();
  }
}
paginatePlanning(event) {
  this.paginatorOut.emit(this.paginatorIn);
}

storePlanning(planning: Planning, flag = false) {
  this.spinnerService.show();
  this.uicHttpService.store('plannings', { planning }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.savePlanning(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
          this.formPlanningIn.reset();
      } else {
          this.displayOut.emit(false);
      }

  }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
  });
}

// Save in frontend
  savePlanning(planning: Planning) {
      const index = this.planningsIn.findIndex(element => element.id === planning.id);
      if (index === -1) {
          this.planningsIn.push(planning);
      } else {
          this.planningsIn[index] = planning;
      }
      this.planningsOut.emit(this.planningsIn);
  }

 // Save in backend
 updatePlanning(planning: Planning) {
  this.spinnerService.show();
  this.uicHttpService.update('plannings/' + planning.id, { planning })
      .subscribe(response => {
          this.spinnerService.hide();
          this.messageService.success(response);
          this.savePlanning(response['data']);
          this.displayOut.emit(false);
      }, error => {
          this.spinnerService.hide();
          this.messageService.error(error);
      });
}
}
