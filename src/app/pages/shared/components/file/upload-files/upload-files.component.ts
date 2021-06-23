import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
    @Input() acceptAttributes = '.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.tar, image/*';
    @Input() multiple = true;
    @Input() maxFileSize = 10240000 * 20;
    @Input() fileLimit = 20;
    @Input() flagUploadFilesIn: boolean;
    @Output() files = new EventEmitter<any[]>();
    @Output() flagUploadFilesOut = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    upload(event, target) {
        target.clear();
        this.flagUploadFilesOut.emit(true);
        this.files.emit(event.files);
    }

}
