import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

import * as $ from 'jquery';
import 'jquery-form';
@Component({
    selector: 'app-capitulo',
    templateUrl: './capitulo.component.html',
    styleUrls: ['./capitulo.component.css']
})
export class CapituloComponent implements OnInit {
    constructor(
        private admin: AdminService
    ){}
    ngOnInit(){
        
    }
    submit(): void{

    }
}
