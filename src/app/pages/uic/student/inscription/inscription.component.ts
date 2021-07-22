import { UicHttpService } from 'src/app/services/uic/uic-http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  constructor(
    private uicHttpService: UicHttpService) { }

  ngOnInit(): void {
  }

  // downloadEnrollment(){
  //   this.uicHttpService.downloadEnrollment(1);
  // }
  downloadEnrollment(){
    this.uicHttpService.getCertificados('export-enrollment').subscribe(response=>{
        const data=[];
        data.push(response);
        const file=URL.createObjectURL(new Blob(data,{type:response['type']}));
        const download= document.createElement('a');

        download.href=file;
        download.setAttribute('download','Certificado de matricula.pdf');
        document.body.appendChild(download);
        download.click();            
      });
      
  }

  downloadEnrollmentRequest(){
    this.uicHttpService.getCertificados('export-enrollment-request').subscribe(response=>{
        const data=[];
        data.push(response);
        const file=URL.createObjectURL(new Blob(data,{type:response['type']}));
        const download= document.createElement('a');

        download.href=file;
        download.setAttribute('download','Solicitud de matricula.pdf');
        document.body.appendChild(download);
        download.click();            
      });
      
  }
      

}
