import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Event as EventModel } from 'src/app/models/uic/event';
import { Student } from 'src/app/models/app/student';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  checked: boolean = false;

  @Input() formStudentFormIn: FormGroup;
  @Input() studentFormsIn: Student[];
  @Input() paginatorIn: Paginator;

  @Output() displayOut = new EventEmitter<boolean>();
  @Output() studentFormsOut = new EventEmitter<Student[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  plannings: Planning[];
  events: EventModel[];
  selectedPlanning: Planning;
  selectedEvent: EventModel;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
  ) { 
    
  }
  ngOnInit(): void {
    
  }
  // Fields of Form
  get idField() {
    return this.formStudentFormIn.get('id');
  }
  get userField() {
    return this.formStudentFormIn.get('user');
  }
  get adressField() {
    return this.formStudentFormIn.get('address');
  }
  get schoolTypeField() {
    return this.formStudentFormIn.get('school_type');
  }
  // Submit Form
  onSubmit(event: Event, flag = false) {
    debugger
    event.preventDefault();
    if (this.formStudentFormIn.valid) {
      if (this.idField.value) {
        this.updateStudentForm(this.formStudentFormIn.value);
      } else {
        this.storeStudentForm(this.formStudentFormIn.value, flag);
        this.formStudentFormIn.reset();
      }
    } else {
      this.formStudentFormIn.markAllAsTouched();
    }
  }
  paginateStudentForm(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  storeStudentForm(studentForm: Student, flag = false) {
    this.spinnerService.show();
    this.uicHttpService.store('student', { studentForm }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveStudentForm(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formStudentFormIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveStudentForm(studentForm: Student) {
    const index = this.studentFormsIn.findIndex(element => element.id === studentForm.id);
    if (index === -1) {
      this.studentFormsIn.push(studentForm);
    } else {
      this.studentFormsIn[index] = studentForm;
    }
    this.studentFormsOut.emit(this.studentFormsIn);
  }

  // Save in backend
  updateStudentForm(studentForm: Student) {
    this.spinnerService.show();
    this.uicHttpService.update('student/' + studentForm.id, { studentForm })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveStudentForm(response['data']);
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }

}
