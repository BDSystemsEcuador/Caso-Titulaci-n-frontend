import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// PrimeNg Modules
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { ConfirmationService, MessageService } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { RadioButtonModule } from "primeng/radiobutton";
import { RippleModule } from "primeng/ripple";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";

// Components
import { DateComponent } from "./components/date/date.component";
import { LocationAddressComponent } from "./components/location-address/location-address.component";
import { LocationComponent } from "./components/location/location.component";
import { SkeletonComponent } from "./components/skeleton/skeleton.component";
import { UploadFilesComponent } from "./components/file/upload-files/upload-files.component";
import { ViewFilesComponent } from "./components/file/view-files/view-files.component";

// Pipes
import { ExtensionsPipe } from "./pipes/extensions.pipe";
import { MonthsPipe } from "./pipes/months.pipe";
import { CardModule } from "primeng/card";
// My Components
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNg Modules
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    InputTextareaModule,
    InputTextModule,
    PaginatorModule,
    RadioButtonModule,
    RippleModule,
    SkeletonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
  ],
  declarations: [
    // Components
    DateComponent,
    LocationAddressComponent,
    LocationComponent,
    SkeletonComponent,
    UploadFilesComponent,
    ViewFilesComponent,
    // Pipes
    ExtensionsPipe,
    MonthsPipe,
  ],
  exports: [
    DateComponent,
    LocationAddressComponent,
    LocationComponent,
    SkeletonComponent,
    UploadFilesComponent,
    ViewFilesComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class SharedModule {}
