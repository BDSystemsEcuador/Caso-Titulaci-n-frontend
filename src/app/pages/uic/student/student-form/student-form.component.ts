import { Catalogue } from './../../../../models/app/catalogue';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Event as EventModel } from 'src/app/models/uic/event';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { StudentInformation } from 'src/app/models/uic/student-information';
import { AppHttpService } from 'src/app/services/app/app-http.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentInformationFormComponent implements OnInit {

  selectedRelation: any = null;
  relations: any;
  areas: any;
  positions: any;
  studentInformation: StudentInformation;

  selectedCategory: any = null;


  @Input() formStudentInformationIn: FormGroup;
  @Input() studentInformationIn: StudentInformation;
  @Input() studentInformationFormsIn: StudentInformation[];
  @Input() paginatorIn: Paginator;

  @Output() displayOut = new EventEmitter<boolean>();
  @Output() studentInformationFormsOut = new EventEmitter<StudentInformation[]>();
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
    private appHttpService: AppHttpService
  ) { 
    
  }
  ngOnInit(): void {
    this.getAreas();
    this.getPositions();
    this.getRelations();
    this.getStudentInformation();
  }
  // Fields of Form
  get idField() {
    return this.formStudentInformationIn.get('id');
  }
  get companyWorkField() {
    return this.formStudentInformationIn.get('company_work');
  }
  get relationLaboralCareerField() {
    return this.formStudentInformationIn.get('relation_laboral_career');
  }
  get companyAreaField() {
    return this.formStudentInformationIn.get('company_area');
  }
  get companyPositionField() {
    return this.formStudentInformationIn.get('company_position');
  }
  // Submit Form
  onSubmit(event: Event, flag = false) {
    event.preventDefault();
    if (this.formStudentInformationIn.valid) {
      
      if (this.idField.value) {
        this.updateStudentInformationForm(this.formStudentInformationIn.value);
      } else {
        this.storeStudentInformationForm(this.formStudentInformationIn.value, flag);
        this.formStudentInformationIn.reset();
      }
    } else {
      this.formStudentInformationIn.markAllAsTouched();
    }
  }
  paginateStudentInformationForm(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  getStudentInformationForm() {
    debugger
    this.formStudentInformationIn.patchValue(this.studentInformation);
  }

  getStudentInformation(){
    
    this.uicHttpService.get("student-informations/" + 1).subscribe(
      (response) => {
        debugger
        this.studentInformation = response["data"];
        this.getStudentInformationForm();
        this.selectedCategory = this.studentInformation.relation_laboral_career.name;
      },
      (error) => {
        this.messageService.error(error);
      }
    );

  }

  storeStudentInformationForm(studentInformation: StudentInformation, flag = false) {
    
    this.spinnerService.show();
    this.uicHttpService.store('student-informations', { studentInformation }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      
      this.saveStudentInformationForm(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formStudentInformationIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveStudentInformationForm(studentInformation: StudentInformation) {
    const index = this.studentInformationFormsIn.findIndex(element => element.id === studentInformation.id);
    if (index === -1) {
      this.studentInformationFormsIn.push(studentInformation);
    } else {
      this.studentInformationFormsIn[index] = studentInformation;
    }
    this.studentInformationFormsOut.emit(this.studentInformationFormsIn);
  }

  // Save in backend
  updateStudentInformationForm(studentInformation: StudentInformation) {
    this.spinnerService.show();
    this.uicHttpService.update('student-informations/' + studentInformation.id, { studentInformation })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveStudentInformationForm(response['data']);
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }

  getAreas() {
    this.appHttpService.getCatalogues('UIC.STUDENT_INFORMATIONS.COMPANY_AREA').subscribe((response) => {
      this.areas = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }

  getPositions() {
    this.appHttpService.getCatalogues('UIC.STUDENT_INFORMATIONS.COMPANY_POSITION').subscribe((response) => {
      this.positions = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }

  getRelations() {
    this.appHttpService.getCatalogues('UIC.STUDENT_INFORMATIONS.RELATIONAL_LABORAL_CAREER').subscribe((response) => {
      this.relations = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }

}
