import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import * as $ from 'jquery';
import { ConfirmComponent } from '../../../modals/modal';
import { PageEvent } from '@angular/material';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import { MatSnackBar, MatDialog } from '@angular/material';
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
        private admin: AdminService,
        private snack: MatSnackBar,
        private dialog: MatDialog
    ){}
    public publicaciones: Array<any> = [];
    public hasError: boolean = false;
    public isLoaded: boolean = false;
    public pageEvent: PageEvent;
    public pageSizeOptions: number[] = [10, 20, 40, 80, 100];
    confirm(title: string, message: string, fs: Function, fe?: Function): void{
        ConfirmComponent.confirm = () => {
            fs();
            this.dialog.closeAll();
        }
        ConfirmComponent.close = () => {
            if(fe) fe();
            this.dialog.closeAll();
        }
        ConfirmComponent.title = title;
        ConfirmComponent.message = message;
        this.dialog.open(ConfirmComponent);
    }
    getData(): Array<any>{
        let d = this.publicaciones;
        let nArr: Array<any> = [];
        if(this.pageEvent)
            for(let i = (this.pageEvent.pageIndex * this.pageEvent.pageSize), j = 0; i < (this.pageEvent.pageIndex * this.pageEvent.pageSize) + this.pageEvent.pageSize; i++, j++)
                if(d[i]) nArr[j] = d[i];
                else break;
        else for(let i = 0, j = 0; i <  10; i++, j++) nArr[j] = d[i];
        return nArr;
    }
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
    deleteChapter(id: number): void{
        this.confirm('¡Espera un momento!', '¿Estás seguro de que deseas eliminar el capítulo? No podrás recuperarlo más adelante', () => {
            this.makeSnack("Eliminando capítulo...", 3000);
            this.admin.deleteChapter(id).then(d => {
                if(d.success){
                    this.makeSnack(d.success || "El capítulo se eliminó con éxito.");
                    this.isLoaded = false;
                    this.admin.publicaciones().then(d => {
                        this.isLoaded = true;
                        this.hasError = false;
                        this.publicaciones = d;
                    }).catch(() => {
                        this.hasError = true;
                        this.isLoaded = true;
                    });
                }
                else this.makeSnack(d.error || "Ocurrió un problema al eliminar el capítulo.");
            }).catch(() => {
                this.makeSnack("Ocurrió un error al eliminar el capítulo");
            });
        });
    }
    copy(data: any): void{
        var aux = document.createElement("input");
        aux.setAttribute("value", data);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        this.makeSnack("URL copiado al portapapeles");
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration:n||1500});
    }
}
