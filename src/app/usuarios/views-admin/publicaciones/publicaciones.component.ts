import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import * as $ from 'jquery';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
@Component({
    selector: 'app-publicaciones',
    templateUrl: './publicaciones.component.html',
    styleUrls: ['./publicaciones.component.css'],
    animations: [trigger('popOverState', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.99, .99)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
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
