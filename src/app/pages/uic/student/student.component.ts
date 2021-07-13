import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  formStudentInformation: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildFormStudentInformation();
  }

  buildFormStudentInformation(){
    this.formStudentInformation = this.formBuilder.group({
      id: [null],
      student: [{id: 1}, [Validators.required]],
      company_work: [null, [Validators.required]],
      relation_laboral_career: [null, [Validators.required]],
      company_area: [null, [Validators.required]],
      company_position: [null, [Validators.required]]
    });
  }

}
