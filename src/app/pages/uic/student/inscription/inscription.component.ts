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

  downloadEnrollment(){
    console.log('paso por aqui');
    this.uicHttpService.downloadEnrollment(1);
  }

}
