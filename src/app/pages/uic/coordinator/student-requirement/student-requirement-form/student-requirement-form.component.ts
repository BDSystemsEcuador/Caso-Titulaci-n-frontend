import { Career } from './../../../../../models/app/career';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Student } from 'src/app/models/uic/student';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { AppHttpService } from 'src/app/services/app/app-http.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-student-requirement-form',
  templateUrl: './student-requirement-form.component.html',
  styleUrls: ['./student-requirement-form.component.css']
})
export class StudentRequirementFormComponent implements OnInit {

  @Input() formStudentIn: FormGroup;
  @Input() studentsIn: Student[];
  @Input() paginatorIn: Paginator;
  @Input() disabledFormIn: boolean;
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() studentsOut = new EventEmitter<Student[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  
  selectedCareer:Career;
  careers:Career[];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
    private appHttpService: AppHttpService,
  ) { 
    this.getCareers();
  }

  ngOnInit(): void {
  }
  // Fields of Form
  get careerField() {
    return this.formStudentIn.get('career');
  }
  get nameField() {
    return this.formStudentIn.get('name');
  }
  get startDateField() {
    return this.formStudentIn.get('start_date');
  }
  get endDateField() {
    return this.formStudentIn.get('end_date');
  }
  get descriptionField() {
    return this.formStudentIn.get('description');
  }
  get idField() {
    return this.formStudentIn.get('id');
  }

  // Submit Form
  onSubmit(event: Event, flag = false) {
    event.preventDefault();
    if (this.formStudentIn.valid) {
      if (this.idField.value) {
        this.updateStudent(this.formStudentIn.value);
      } else {
        this.storeStudent(this.formStudentIn.value, flag);
      }
    } else {
      this.formStudentIn.markAllAsTouched();
    }
  }
  paginateStudent(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  storeStudent(student: Student, flag = false) {
    this.spinnerService.show();
    this.uicHttpService.store('students', { student }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveStudent(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formStudentIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveStudent(student: Student) {
    const index = this.studentsIn.findIndex(element => element.id === student.id);
    if (index === -1) {
      this.studentsIn.push(student);
    } else {
      this.studentsIn[index] = student;
    }
    this.studentsOut.emit(this.studentsIn);
  }

  // Save in backend
  updateStudent(student: Student) {
    this.spinnerService.show();
    this.uicHttpService.update('students/' + student.id, { student })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveStudent(response['data']);
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }

  getCareers() {
    this.appHttpService.get('careers').subscribe(response => {
      this.careers = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }

}
