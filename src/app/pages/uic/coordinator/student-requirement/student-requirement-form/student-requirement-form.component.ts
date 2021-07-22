import { element } from 'protractor';
import { MeshStudent } from './../../../../../models/app/mesh-student';
import { HttpParams } from '@angular/common/http';
import { MeshStudentRequirement } from './../../../../../models/uic/mesh-student-requirement';
import { Career } from './../../../../../models/app/career';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Student } from 'src/app/models/uic/student';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { AppHttpService } from 'src/app/services/app/app-http.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { File } from 'src/app/models/app/file';

@Component({
  selector: 'app-student-requirement-form',
  templateUrl: './student-requirement-form.component.html',
  styleUrls: ['./student-requirement-form.component.css']
})
export class StudentRequirementFormComponent implements OnInit {

  dialogDeleteFiles: boolean;
  approvedDocuments: MeshStudentRequirement[] = [];
  document: MeshStudentRequirement;

  formRequirementDelete: FormGroup;

  @Input() formStudentIn: FormGroup;
  @Input() studentsIn: Student[];
  @Input() studentIn: MeshStudent;
  @Input() paginatorIn: Paginator;
  @Input() disabledFormIn: boolean;
  @Input() documentsIn: MeshStudentRequirement[];
  @Input() approvedDocumentsIn: MeshStudentRequirement[];
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

  // Submit Form
  
  paginateStudent(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  approveDocument(document: MeshStudentRequirement){
    
    this.uicHttpService.update('mesh-student-requirement/approve/' + document.id, {document} ).subscribe(response => {
      debugger
      this.messageService.success(response);
      this.removeDocuments([document.id]);
    }, error => {
      debugger
      this.messageService.error(error);

    });
  }

  removeDocuments(ids) {
    debugger
    for (const id of ids) {
      debugger
        this.documentsIn = this.documentsIn.filter(element => element.id !== id);
    }
  }

  download(file: File) {
    
    const params = new HttpParams().append('full_path', file.full_path);
    this.appHttpService.downloadFiles(params).subscribe(response => {
        const binaryData = [];
        binaryData.push(response);
        const filePath = URL.createObjectURL(new Blob(binaryData, {type: response['type']}));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', file.full_name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }, error => {
        this.messageService.error(error);
    });
}

  // getStudents() {
  //   debugger
  //   if(this.disabledFormIn == true){
  //       this.observationsField.clear();
  //       for(const observation of this.studentIn['observations']) {
  //         this.addObservation(observation);
  //        }
  //       }
  // }

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

  openDeleteRequirement(document: MeshStudentRequirement){
    this.buildFormRequirementDelete(document);
    this.formRequirementDelete.patchValue(document);
  }

  buildFormRequirementDelete(document: MeshStudentRequirement){
    debugger
    this.formRequirementDelete = this.formBuilder.group({
      id: [document.id],
      requirement_id: [document.requirement.id, [Validators.required]],
      observations: [null, [Validators.required]]
    });
  }

  get idField() {
    return this.formRequirementDelete.get('id');
  }

  get observationField() {
    return this.formRequirementDelete.get('observations');
  }

  onSubmit(event: Event) {

    event.preventDefault();
    debugger
    if (this.formRequirementDelete.valid) {
      if (this.idField.value) {
        this.updateRequirementDelete(this.formRequirementDelete.value);
      } 
    } else {
      this.formRequirementDelete.markAllAsTouched();
    }
  }

  

  updateRequirementDelete(meshStudentRequirement: MeshStudentRequirement) {
    debugger
    this.spinnerService.show();
    this.uicHttpService.update('mesh-student-requirement/disapproved/' + meshStudentRequirement.id, { meshStudentRequirement })
      .subscribe(response => {
        debugger
        this.spinnerService.hide();
        this.messageService.success(response);
        this.removeDocuments([meshStudentRequirement.id]);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }
}
