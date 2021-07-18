import { Career } from './../../../../../models/app/career';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
  @Input() studentIn: Student;
  @Input() paginatorIn: Paginator;
  @Input() disabledFormIn: boolean;
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() studentsOut = new EventEmitter<Student[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  @Output() paginatorOut = new EventEmitter<Paginator>();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
    private appHttpService: AppHttpService,
  ) { 
  }

  ngOnInit(): void {
    
  }
  // Fields of Form
  get observationsField() {
    return this.formStudentIn.get('observations') as FormArray;
  }
  get idField() {
    return this.formStudentIn.get('id');
  }

  addObservation(observation: any){
    this.observationsField.push(this.formBuilder.control(observation, Validators.required));
  }

  addObservations(){
    this.observationsField.push(this.formBuilder.control(null, Validators.required));
  }
  removeObservations(observation){
      this.observationsField.removeAt(observation);
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

  getStudents() {
    debugger
    if(this.disabledFormIn == true){
      debugger
        this.observationsField.clear();
        for(const observation of this.studentIn['observations']) {
          this.addObservation(observation);
         }
        }
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

}
