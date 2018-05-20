import { Component, OnInit } from '@angular/core';
import { CapitulosService } from '../services/capitulos.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private capitulos: CapitulosService) {}
  ngOnInit() {
    this.capitulos.ultimosCapitulos().then(r => {
      console.log(r);
    });
  }
}
