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
import { Teacher } from 'src/app/models/app/teacher';

@Component({
  selector: 'app-project-plan-form',
  templateUrl: './project-plan-form.component.html',
  styleUrls: ['./project-plan-form.component.css']
})
export class ProjectPlanFormComponent implements OnInit {

  checked: boolean = false;
  students: any;
  teachers:Teacher[];

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
    this.getTeachers();
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
  get teachersField() {
    return this.formProjectPlanIn.get('teachers') as FormArray;
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
    this.teachersField.push(this.formBuilder.control(null, Validators.required));
  }
  
  removeTutors(tutor){
      this.teachersField.removeAt(tutor);
  }
  // Submit Form
  // onSubmit(event: Event, flag = false) {
  //   event.preventDefault();
  //   if (this.formProjectPlanIn.valid) {
  //     if (this.idField.value) {
  //       this.updateProjectPlan(this.formProjectPlanIn.value);
  //     } else {
  //       this.storeProjectPlan(this.formProjectPlanIn.value);
  //       this.formProjectPlanIn.reset();
  //     }
  //   } else {
  //     this.formProjectPlanIn.markAllAsTouched();
  //   }
  // }

  onSubmit(event: Event, flag = false) {
    event.preventDefault();
    if (this.formProjectPlanIn.valid) {
      if (this.idField.value) {
        this.updateProjectPlan(this.formProjectPlanIn.value);
      } else {
        this.storeProjectPlan(this.formProjectPlanIn.value, flag);
      }
    } else {
      this.formProjectPlanIn.markAllAsTouched();
    }
  }

  paginateProjectPlan(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  // storeProjectPlan(projectPlan: ProjectPlan) {
  //   this.spinnerService.show();
  //   this.uicHttpService.store('project-plans', { projectPlan }).subscribe(response => {
      
  //     this.spinnerService.hide();
  //     this.messageService.success(response);
  //     this.saveProjectPlan(response['data']);
  //     this.paginatorOut.emit(this.paginatorIn);

  //   }, error => {
  //     this.spinnerService.hide();
  //     this.messageService.error(error);
  //   });
  // }

  storeProjectPlan(projectPlan: ProjectPlan, flag = false) {
    debugger
    this.spinnerService.show();
    this.uicHttpService.store('project-plans', { projectPlan }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveProjectPlan(response['data']);
      this.paginatorOut.emit(this.paginatorIn);
      debugger
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
    debugger
    const index = this.projectPlansIn.findIndex(element => element.id === projectPlan.id);
    if (index === -1) {
      this.projectPlansIn.push(projectPlan);
    } else {
      this.projectPlansIn[index] = projectPlan;
    }
    this.projectPlansOut.emit(this.projectPlansIn);
    this.displayOut.emit(false);
  }

  // Save in backend
  updateProjectPlan(projectPlan: ProjectPlan) {
    this.spinnerService.show();
    this.uicHttpService.update('project-plans/' + projectPlan.id, { projectPlan })
      .subscribe(response => {
        this.spinnerService.hide();
        this.messageService.success(response);
        this.saveProjectPlan(response['data']);
        debugger
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

  getTeachers() {
    this.uicHttpService.get('project-plan/teachers').subscribe(response => {
      this.teachers = response['data'];
    }, error => {
      this.messageService.error(error);
    });
  }
}
