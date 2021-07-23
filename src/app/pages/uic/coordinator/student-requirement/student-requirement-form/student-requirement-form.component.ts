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
import { Requirement } from 'src/app/models/uic/requirement';

@Component({
  selector: 'app-student-requirement-form',
  templateUrl: './student-requirement-form.component.html',
  styleUrls: ['./student-requirement-form.component.css']
})
export class StudentRequirementFormComponent implements OnInit {

  dialogDeleteFiles: boolean;
  approvedDocuments: MeshStudentRequirement[] = [];
  document: MeshStudentRequirement;
  requirements: Requirement[] = [];
  disapprovedRequirements: MeshStudentRequirement[] = [];
  studentRequirements: MeshStudentRequirement[] = [];

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
  @Output() studentOut = new EventEmitter<Student>();
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
    this.getRequirements();
  }

  // Submit Form
  
  paginateStudent(event) {
    this.paginatorOut.emit(this.paginatorIn);
  }

  approveDocument(meshStudentRequirement: MeshStudentRequirement){
    
    this.uicHttpService.update('mesh-student-requirement/approve/' + meshStudentRequirement.id, {meshStudentRequirement} ).subscribe(response => {
      
      this.messageService.success(response);
      //this.removeDocuments([document.id]);
      this.getRequirements();

    }, error => {
      this.messageService.error(error);

    });
  }

  async getRequirements(){

    let result = await this.uicHttpService.get("requirements").toPromise();
          this.requirements = result["data"];

          result = await this.uicHttpService.get("mesh-student-requirements").toPromise();

      this.studentRequirements = await result['data'];
      
      this.verifyDocuments();
  
    }

    storeRequirement(event, meshStudentRequirement: MeshStudentRequirement) {
    
      this.uicHttpService.store('mesh-student-requirements', { meshStudentRequirement }).subscribe(response => {
        this.upload(event, response['data'].id);
        this.getRequirements();
        this.messageService.success(response);
      }, error => {
        this.messageService.error(error);
      });
    }

    upload(event, id) {
    
      const formData = new FormData();
      for (const file of event) {
        formData.append("files[]", file);
      }
      formData.append("id", id.toString());
      this.spinnerService.show();
      this.uicHttpService.uploadFiles("mesh-student-requirement/file", formData).subscribe(
        (response) => {
          
          this.spinnerService.hide();
          this.messageService.success(response);
  
          this.getRequirements();
        },
        (error) => {
          
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }

    verifyDocuments() {
      for (const studentRequirement of this.studentRequirements) {
          this.requirements = this.requirements.filter(element => element.id !== studentRequirement.requirement.id);
      }
    }

  removeDocuments(ids) {
    for (const id of ids) {
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
    if (this.formRequirementDelete.valid) {
      if (this.idField.value) {
        this.rejectDocument(this.formRequirementDelete.value);
      } 
    } else {
      this.formRequirementDelete.markAllAsTouched();
    }
  }

//   verifyDisapprovedDocuments(document: MeshStudentRequirement) {
//     for (let requirement of this.documentsIn) {
//       if(requirement.is_approved == true){
        
//         if(document.id == requirement.id){
//           this.documentsIn.push(document);
//       }

//       }
//     }
//     for (let requirement of this.approvedRequirements) {
//       if(document.id == requirement.id){
//         this.approvedRequirements = this.approvedRequirements.filter(element => element.id !== document.id);
//         this.documentsIn.push(document);
//       }
//     }
// }

  rejectDocument(meshStudentRequirement: MeshStudentRequirement) {
    this.uicHttpService.update('mesh-student-requirement/reject/' + meshStudentRequirement.id, { meshStudentRequirement })
      .subscribe(response => {
        this.messageService.success(response);
        this.getRequirements();
      }, error => {
        this.messageService.error(error);
      });
  }
}
