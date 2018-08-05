import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import * as $ from 'jquery';
@Component({
    selector: 'app-publicaciones',
    templateUrl: './publicaciones.component.html',
    styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
    constructor(
        private admin: AdminService
    ){}
    public publicaciones: Array<any> = [];
    public hasError: boolean = false;
    public isLoaded: boolean = false;
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Mis publicaciones | BMANGA');
        this.admin.publicaciones().then(d => {
            this.isLoaded = true;
            this.hasError = false;
            this.publicaciones = d;
        }).catch(() => {
            this.hasError = true;
            this.isLoaded = true;
        });
    }
}
