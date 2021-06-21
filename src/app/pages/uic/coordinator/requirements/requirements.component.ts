import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Requirement } from 'src/app/models/uic/requirement';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { MessageService } from '../../../shared/services/message.service';
import { DateValidators } from '../../../shared/validators/date.validators';
@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {
  paginator:Paginator;
  requirements: Requirement[];
  formRequirement: FormGroup;
  requirement: Requirement;
  requirementDialog: boolean;
  flagRequirements: boolean;
  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService
  ) {
    this.paginator = { current_page:1, per_page:5};
    this.requirements = [];
   }

  ngOnInit(): void {
    this.buildFormRequirement();
    this.getRequirements(this.paginator);
  }
 // Build form course
 buildFormRequirement() {
  this.formRequirement = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      is_required: [null, [Validators.required]]
  });
} 

  getRequirements(paginator:Paginator){
  const params = new HttpParams()
    .append('page', paginator.current_page.toString())
    .append('per_page', paginator.per_page.toString());
  this.flagRequirements = true;
  this.uicHttpService.get('requirements', params).subscribe(
    response => {
      this.flagRequirements = false;
      this.requirements = response['data'];
      this.paginator = response as Paginator;
    }, error =>{
      this.flagRequirements = false;
      this.messageService.error(error);
    }
  );
  }


}
