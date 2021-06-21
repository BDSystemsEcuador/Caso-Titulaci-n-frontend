import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Requirement } from 'src/app/models/uic/requirement';
import { MessageService } from 'src/app/pages/shared/services/message.service';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.css']
})
export class RequirementsFormComponent implements OnInit {
  @Input() formRequirementIn: FormGroup;
  @Input() requirementsIn: Requirement[];
  @Output() displayOut = new EventEmitter<boolean>();
  @Output() requirementsOut = new EventEmitter<Requirement[]>();
  @Output() paginatorAdd = new EventEmitter<number>();
  constructor(
    private formBuilder:FormBuilder,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService,
    private uicHttpService: UicHttpService,
  ){ }

  ngOnInit(): void {
  }

// Fields of Form
get nameField() {
  return this.formRequirementIn.get('name');
}
get isRequiredField() {
  return this.formRequirementIn.get('is_required');
}
get idField() {
  return this.formRequirementIn.get('id');
}

// Submit Form
onSubmit(event: Event, flag = false) {
  event.preventDefault();
  if (this.formRequirementIn.valid) {
      if (this.idField.value) {
          this.updateRequirement(this.formRequirementIn.value);
      } else {
          this.storeRequirement(this.formRequirementIn.value, flag);
          this.formRequirementIn.reset();
      }
  } else {
      this.formRequirementIn.markAllAsTouched();
  }
}
storeRequirement(requirement: Requirement, flag = false) {
  this.spinnerService.show();
  this.uicHttpService.store('requirements', { requirement }).subscribe(response => {
      this.spinnerService.hide();
      this.messageService.success(response);
      this.saveRequirement(response['data']);
      if (flag) {
          this.formRequirementIn.reset();
      } else {
          this.displayOut.emit(false);
      }

  }, error => {
      this.spinnerService.hide();
      this.messageService.error(error);
  });
}

// Save in frontend
  saveRequirement(requirement: Requirement) {
      const index = this.requirementsIn.findIndex(element => element.id === requirement.id);
      if (index === -1) {
          this.requirementsIn.push(requirement);
      } else {
          this.requirementsIn[index] = requirement;
      }
      this.requirementsOut.emit(this.requirementsIn);
  }

 // Save in backend
 updateRequirement(requirement: Requirement) {
  this.spinnerService.show();
  this.uicHttpService.update('requirements/' + requirement.id, { requirement })
      .subscribe(response => {
          this.spinnerService.hide();
          this.messageService.success(response);
          this.saveRequirement(response['data']);
          this.displayOut.emit(false);
      }, error => {
          this.spinnerService.hide();
          this.messageService.error(error);
      });
}
}
