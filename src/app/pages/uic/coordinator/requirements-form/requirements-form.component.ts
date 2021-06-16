import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.css']
})
export class RequirementsFormComponent implements OnInit {
  uploadedFiles: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
}
}
