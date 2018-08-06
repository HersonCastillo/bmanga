import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import { MatSnackBar, MatDialog } from '@angular/material';
import * as $ from 'jquery';
import 'jquery-form';
@Component({
    selector: 'app-edit-capitulo',
    templateUrl: './edit-capitulo.component.html',
    styleUrls: ['./edit-capitulo.component.css'],
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
export class EditCapituloComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private admin: AdminService,
        private dialog: MatDialog,
        private snack: MatSnackBar,
        private router: Router
    ) {}
    public isLoad: boolean = false;
    public isError: boolean = false;
    public model = {
        titulo: "",
        capitulo: 0,
        joint: "",
        id: -1
    }
    //public url: string = this.admin.urlToEditImageBook;
    public infoMod: boolean = false;
    public uploading: boolean = false;
    public valueUpload: number = 0;
    ngOnInit(){
        this.route.params.subscribe(parm => {
            let id = parm['id'];
            this.admin.editChapter(id).then(data => {
                if(data.error){
                    this.makeSnack("Ocurrió un error al obtener la información del capítulo.");
                    this.router.navigate(['/@dashboard','admin']);
                    return;
                }
                this.isError = false;
                this.isLoad = true;
                this.model.titulo = (data.titulo) ? data.titulo : "";
                this.model.joint = (data.joint) ? data.joint : "";
                this.model.capitulo = +data.capitulo;
                this.model.id = data.id;
            }).catch(() => {
                this.isLoad = true;
                this.isError = true;
            });
        });
    }
    submitInfo(): void{
        this.model.titulo = this.model.titulo.trim();
        this.model.joint = this.model.joint.trim();
        let cap = this.model.capitulo;
        if(cap >= 0 && cap <= 2999){
            this.infoMod = true;
            this.admin.editInfoChapter(this.model).then(d => {
                this.infoMod = false;
                if(d.success) this.makeSnack(d.success || "Capítulo actualizado", 3000);
                else this.makeSnack(d.error || "El capítulo no se puede actualizar", 3500);

                if(d.error) this.router.navigate(['/@dashboard','admin']);
            }).catch(() => {
                this.infoMod = false;
                this.makeSnack("Ocurrió un error al editar el capítulo.");
                this.router.navigate(['/@dashboard','admin']);
            });
        } else this.makeSnack("El número de capítulo no es válido.");
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration: n||1500});
    }
}
