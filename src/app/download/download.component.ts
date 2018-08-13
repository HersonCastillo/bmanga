import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CapitulosService } from '../services/capitulos.service';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import { SimpleComponent } from '../modals/modal';
@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css'],
    animations: [trigger('popOverState', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.9, .9)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
})
export class DownloadComponent implements OnInit {
    constructor(
        private admin: AdminService,
        private caps: CapitulosService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ){}
    public isLoad: boolean = false;
    public urlLoad: boolean = false;
    public model = {
        nombre: "",
        capitulo: 0,
        url: "",
        id: -1,
        img: ""
    }
    simple(title: string, message: string): void{
        SimpleComponent.close = () => this.dialog.closeAll();
        SimpleComponent.title = title;
        SimpleComponent.message = message;
        this.dialog.open(SimpleComponent);
    }
    getImage(imageUrl: string): string{
        if(imageUrl) return "https://i1.wp.com/bmanga.net/" + imageUrl;
        return "assets/img/cloud.png";
    }
    ngOnInit(){
        $("title").text("Descargar capítulo | BMANGA");
        this.route.params.subscribe(parm => {
            let id = parseInt("0x" + parm['id']);
            this.admin.editChapter(id).then(d => {
                this.isLoad = true;
                if(d.error){
                    this.simple("Un problema...", "Ocurrió un error al generar la descarga");
                    this.router.navigate(['/']);
                    return;
                }
                this.model.nombre = d.nombre;
                this.model.capitulo = +d.capitulo;
                this.model.id = parm['id'];
                this.model.img = d.imagen;
                this.urlLoad = false;
                $("title").text("Descargar " + d.nombre + " " + d.capitulo + " | BMANGA");
                this.caps.descargar(this.model.id).subscribe(response => {
                    this.model.url = response._body;
                    this.urlLoad = true;
                }, err => {
                    this.simple("¡Ups!", "Ocurrió un error desconocido... Lo solventaremos luego.");
                    this.router.navigate(['error']);
                });
            });
        });
    }

}
