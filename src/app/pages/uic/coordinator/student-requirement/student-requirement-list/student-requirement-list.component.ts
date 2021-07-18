import { StudentRequirementFormComponent } from './../student-requirement-form/student-requirement-form.component';
import { StudentComponent } from './../../../student/student.component';
import { HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Col } from "src/app/models/setting/col";
import { Paginator } from "src/app/models/setting/paginator";
import { Student } from "src/app/models/uic/student";
import { MessageService } from "src/app/pages/shared/services/message.service";
import { UicHttpService } from "src/app/services/uic/uic-http.service";
import { StudentInformationFormComponent } from '../../../student/student-form/student-form.component';

@Component({
  selector: 'app-student-requirement-list',
  templateUrl: './student-requirement-list.component.html',
  styleUrls: ['./student-requirement-list.component.css']
})
export class StudentRequirementListComponent implements OnInit {

  @Input() flagStudents: boolean;
  @Input() studentsIn: Student[];
  @Input() studentsEndIn: Student[];
  @Input() paginatorIn: Paginator;
  @Input() formStudentIn: FormGroup;
  @Input() displayIn: boolean;
  @Output() studentsOut = new EventEmitter<Student[]>();
  @Output() studentOut = new EventEmitter<Student>();
  @Output() studentsEndOut = new EventEmitter<Student[]>();
  @Output() formStudentOut = new EventEmitter<FormGroup>();
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() paginatorOut = new EventEmitter<Paginator>();
  @Output() disabledFormOut = new EventEmitter<boolean>();
  colsStudent: Col[];
  selectedStudents: any[];

  selectedStudent: Student;

  currentDate = new Date().toDateString();
  constructor(
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
    private formBuilder: FormBuilder
  ) {
    this.resetPaginatorStudents();

    console.log(this.currentDate);
  }


  ngOnInit(): void {
    this.loadColsStudent();
  }
  loadColsStudent() {
    this.colsStudent = [
      { field: "project_plan", header: "Proyecto" },
      { field: "mesh_student", header: "Estudiante" },
      { field: "observations", header: "Observaciones" },
    ];
  }

  openNewFormStudent() {
    this.formStudentIn.reset();
    this.formStudentOut.emit(this.formStudentIn);
    this.displayOut.emit(true);
    this.disabledFormOut.emit(false);
  }

  openEditFormStudent(student: Student) {
    debugger
    this.formStudentIn.patchValue(student);
    this.formStudentOut.emit(this.formStudentIn);
    this.displayOut.emit(true);
    this.disabledFormOut.emit(true);
    this.studentOut.emit(student);
    this.getStudents(student);
  }

  get observationsField() {
    return this.formStudentIn.get('observations') as FormArray;
  }

  addObservation(observation: any){
    this.observationsField.push(this.formBuilder.control(observation, Validators.required));
  }

  getStudents(student: Student) {
    this.observationsField.clear();
    for(const observation of student['observations']) {
      this.addObservation(observation);
      }
  }

  paginateStudent(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  resetPaginatorStudents() {
    this.paginatorIn = { current_page: 1, per_page: 5 };
  }

  deleteStudent(student: Student) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.uicHttpService
          .delete("student/delete", { ids: student.id })
          .subscribe(
            (response) => {
              this.spinnerService.hide();
              this.messageService.success(response);
              this.removeStudent(student);
            },
            (error) => {
              this.spinnerService.hide();
              this.messageService.error(error);
            }
          );
      }
    });
  }

  // no se utiliza VERIFICAR DDE NUEVO
  removeStudent(student: Student) {
    this.studentsIn = this.studentsIn.filter(
      (element) => element !== student
    );
    this.studentsOut.emit(this.studentsIn);
  }

  deleteStudents(student = null) {
    this.messageService.questionDelete({}).then((result) => {
      if (result.isConfirmed) {
        ;
        if (student) {
          this.selectedStudents = [];
          this.selectedStudents.push(student);
        }
        const ids = this.selectedStudents.map((element) => element.id);
        this.spinnerService.show();
        this.uicHttpService.delete("student/delete", ids).subscribe(
          (response) => {
            this.spinnerService.hide();
            this.messageService.success(response);
            this.removeStudents(ids);
            this.selectedStudents = [];
          },
          (error) => {
            this.spinnerService.hide();
            this.messageService.error(error);
          }
        );
      }
    });
  }
  searchStudents(event, search) {
    if (event.type === "click" || event.keyCode === 13 || search.length === 0) {
      const params =
        search.length > 0 ? new HttpParams().append("search", search) : null;
      this.spinnerService.show();
      this.uicHttpService.get("students", params).subscribe(
        (response) => {
          (this.studentsIn = response["data"]), this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.messageService.error(error);
        }
      );
    }
  }
  // no se utiliza
  removeStudents(ids) {
    for (const id of ids) {
      this.studentsIn = this.studentsIn.filter(
        (element) => element.id !== id
      );
    }
    this.studentsOut.emit(this.studentsIn);
  }


  selectStudent(student: Student) {
    this.selectedStudent = student;
  }

  pageChange(event) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

}
