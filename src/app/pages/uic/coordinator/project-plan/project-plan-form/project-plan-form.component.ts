import { Student } from './../../../../../models/app/student';
import { Tutor } from './../../../../../models/uic/tutor';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Event as EventModel } from 'src/app/models/uic/event';
import { ProjectPlan } from 'src/app/models/uic/project-plan';
import { Planning } from 'src/app/models/uic/planning';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { AppHttpService } from 'src/app/services/app/app-http.service';

@Component({
  selector: 'app-project-plan-form',
  templateUrl: './project-plan-form.component.html',
  styleUrls: ['./project-plan-form.component.css']
})
export class ProjectPlanFormComponent implements OnInit {

  checked: boolean = false;
  students: any;
  tutors: any;

  @Input() formProjectPlanIn: FormGroup;
  @Input() projectPlansIn: ProjectPlan[];
  @Input() paginatorIn: Paginator;

  @Output() displayOut = new EventEmitter<boolean>();
  @Output() projectPlansOut = new EventEmitter<ProjectPlan[]>();
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
    this.getStudents();
    this.getTutors();
  }
  // Fields of Form
  get idField() {
    return this.formProjectPlanIn.get('id');
  }
  get titleField() {
    return this.formProjectPlanIn.get('title');
  }
  get descriptionField() {
    return this.formProjectPlanIn.get('description');
  }
  get actCodeField() {
    return this.formProjectPlanIn.get('act_code');
  }
  get approvalDateField() {
    return this.formProjectPlanIn.get('approval_date');
  }
  get isApprovedField() {
    return this.formProjectPlanIn.get('is_approved');
  }
  get observationsField() {
    return this.formProjectPlanIn.get('observations') as FormArray;
  }
  get studentsField() {
    return this.formProjectPlanIn.get('students') as FormArray;
  }
  get tutorsField() {
    return this.formProjectPlanIn.get('tutors') as FormArray;
  }

  addObservations(){
    this.observationsField.push(this.formBuilder.control(null, Validators.required));
  }
  removeObservations(observation){
      this.observationsField.removeAt(observation);
  }

  addStudents(){
    this.studentsField.push(this.formBuilder.control(null, Validators.required));
  }

  removeStudents(student){
      this.studentsField.removeAt(student);
  }

  addTutors(){
    this.tutorsField.push(this.formBuilder.control(null, Validators.required));
  }
  
  removeTutors(tutor){
      this.tutorsField.removeAt(tutor);
  }
  // Submit Form
  onSubmit(event: Event, flag = false) {
    
    event.preventDefault();
    if (this.formProjectPlanIn.valid) {
      if (this.idField.value) {
        this.updateProjectPlan(this.formProjectPlanIn.value);
      } else {
        this.storeProjectPlan(this.formProjectPlanIn.value, flag);
        this.formProjectPlanIn.reset();
      }
    } else {
      this.formProjectPlanIn.markAllAsTouched();
    }
  }
  paginateProjectPlan(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  storeProjectPlan(projectPlan: ProjectPlan, flag = false) {
    this.spinnerService.show();
    this.uicHttpService.store('project-plans', { projectPlan }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveProjectPlan(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      if (flag) {
        this.formProjectPlanIn.reset();
      } else {
        this.displayOut.emit(false);
      }

    }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
    });
  }

  // Save in frontend
  saveProjectPlan(projectPlan: ProjectPlan) {
    const index = this.projectPlansIn.findIndex(element => element.id === projectPlan.id);
    if (index === -1) {
      this.projectPlansIn.push(projectPlan);
    } else {
      this.projectPlansIn[index] = projectPlan;
    }
    this.projectPlansOut.emit(this.projectPlansIn);
  }

  // Save in backend
  updateProjectPlan(projectPlan: ProjectPlan) {
    this.spinnerService.show();
    this.uicHttpService.update('project-plans/' + projectPlan.id, { projectPlan })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveProjectPlan(response['data']);
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }

  getStudents() {
    this.uicHttpService.get('students').subscribe(response => {
      this.students = response;
      console.log(this.students);
    }, error => {
      this.messageService.error(error);
    });
  }

  getTutors() {
    this.uicHttpService.get('tutors').subscribe(response => {
      this.tutors = response;
    }, error => {
      this.messageService.error(error);
    });
  }
}
