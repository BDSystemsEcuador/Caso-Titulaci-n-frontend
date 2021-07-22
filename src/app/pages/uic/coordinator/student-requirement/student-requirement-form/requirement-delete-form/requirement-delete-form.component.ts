import { MeshStudentRequirement } from './../../../../../../models/uic/mesh-student-requirement';

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
  selector: 'app-requirement-delete-form',
  templateUrl: './requirement-delete-form.component.html',
  styleUrls: ['./requirement-delete-form.component.css']
})
export class RequirementDeleteFormComponent implements OnInit {

  formRequirementDelete: FormGroup;

  @Output() displayOut = new EventEmitter<boolean>();
  @Input() documentIn: number;

  constructor(
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
  ) { }

  ngOnInit(): void {
    this.buildFormRequirementDelete();
  }

  buildFormRequirementDelete(){
    debugger
    this.formRequirementDelete = this.formBuilder.group({
      id: [null],
      requirement_id: [this.documentIn, [Validators.required]],
      observation: [null, [Validators.required]]
    });
  }

  get idField() {
    return this.formRequirementDelete.get('id');
  }

  get observationField() {
    return this.formRequirementDelete.get('observation');
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
    this.uicHttpService.update('mesh-student-requirement/disapproved' + meshStudentRequirement.id, { meshStudentRequirement })
      .subscribe(response => {
        debugger
        this.spinnerService.hide();
        this.messageService.success(response);
        debugger
        this.displayOut.emit(false);
      }, error => {
        this.spinnerService.hide();
        this.messageService.error(error);
      });
  }

}
