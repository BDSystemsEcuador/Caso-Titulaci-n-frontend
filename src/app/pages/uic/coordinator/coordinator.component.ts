import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Paginator } from 'src/app/models/setting/paginator';
import { Planning } from 'src/app/models/uic/planning';
import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MessageService } from '../../shared/services/message.service';
import { DateValidators } from '../../shared/validators/date.validators';

@Component({
  selector: 'app-coordinator',
  templateUrl: './coordinator.component.html',
  styleUrls: ['./coordinator.component.css']
})
export class CoordinatorComponent implements OnInit {
  formPlanning: FormGroup;
  planning: Planning;
  plannings: Planning[];
  constructor(
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private uicHttpService: UicHttpService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.buildFormPlanning();
  }
  // Build form course
  buildFormPlanning() {
    this.formPlanning = this.formBuilder.group({
        id: [null],
        name: [null, [Validators.required]],
        number: [null, [Validators.required]],
        event: [null, [Validators.required]],
        start_date: [null, [Validators.required, DateValidators.valid]],
        end_date: [null, [Validators.required, DateValidators.valid]],
        description: [null, [Validators.required, Validators.minLength(10)]]
    });
}

}
