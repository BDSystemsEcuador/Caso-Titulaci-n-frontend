import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

// PrimeNG Modules
import {DropdownModule} from 'primeng/dropdown';
import {DateComponent} from './components/date/date.component';
import {MonthsPipe} from './pipes/months.pipe';
import {LocationAddressComponent} from './components/location-address/location-address.component';
import {LocationComponent} from './components/location/location.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { UploadFilesComponent } from './components/file/upload-files/upload-files.component';
import { ViewFilesComponent } from './components/file/view-files/view-files.component';
// My Components
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // PrimeNG Modules
        AutoCompleteModule,
        ButtonModule,
        DropdownModule,
        FieldsetModule,
        InputTextareaModule,
        InputTextModule,
        ToastModule,
        TooltipModule,
    ],
    declarations: [
        DateComponent,
        LocationAddressComponent,
        LocationComponent,
        MonthsPipe,
        SkeletonComponent,
        UploadFilesComponent,
        ViewFilesComponent
    ],
    exports: [DateComponent, LocationComponent, LocationAddressComponent, SkeletonComponent, UploadFilesComponent, ViewFilesComponent,],
    providers: []
})
export class SharedModule {
}
