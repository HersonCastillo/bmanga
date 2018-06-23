import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
    FormControl, 
    FormGroupDirective, 
    NgForm, 
    Validators } 
from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { CapitulosService } from '../services/capitulos.service';
import { SuscripcionesService } from '../services/suscripciones.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
} 
@Component({
    selector: 'app-biblioteca',
    templateUrl: './biblioteca.component.html',
    styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent implements OnInit, OnDestroy {
    constructor(
        private route: ActivatedRoute,
        private libros: LibrosService,
        private capitulos: CapitulosService,
        private suscripcion: SuscripcionesService,
        private snack: MatSnackBar,
        private router: Router
    ) { }
    public matcher = new MyErrorStateMatcher();
    public mangaInformacion: any = {};
    public mangasSimilares: Array<any> = [];
    public otrosMangas: Array<any> = [];
    public chapters: Array<any> = [];
    public paginator: Array<number> = [];
    private page: number = 0;
    public email: string = "";
    private observable: Subscription;
    private id: string = "";
    public isError: any = {
        generalLoad: false
    };
    public mensajeError: string = "";
    public emailControl: any = new FormControl('', [
        Validators.required, 
        Validators.email
    ]);
    envEmail(): void{
        let email = this.email.toString().trim().toLowerCase();
        if(!this.emailControl.hasError('required') && !this.emailControl.hasError('email')){
            this.suscripcion.sendSuscripcion(email, this.mangaInformacion.id).then(r => {
                if(r.success) this.makeSnack(r.success);
                else if(r.error) this.makeSnack(r.error);
                else this.makeSnack('Se encontró un error al ejecutar el servicio. Intentalo más tarde.');
            }).catch(() => {
                this.makeSnack('No se pudo agregar la suscripción para este manga.');
            });
        } else this.makeSnack("Tienes que completar el campo.");
    }
    ngOnDestroy(){
        this.observable.unsubscribe();
    }
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        this.observable = this.route.params.subscribe(subs => {
            this.paginator = [];
            this.id = subs['nombre'];
            $("title").text(this.id + " en BMANGA");
            this.libros.getLibro(this.id).then(r => {
                if(r.error){
                    this.isError.generalLoad = true;
                    this.mensajeError = r.error;
                } else {
                    document.getElementsByTagName("html")[0].scroll(0, 0);
                    this.mangaInformacion = r;
                    this.libros.obrasSimilares(r.generos, r.id).then(s => {
                        this.mangasSimilares = s;
                    });
                    this.libros.otrasObras(r.id).then(o => {
                        this.otrosMangas = o;
                    });
                    this.capitulos.getCapitulos(r.id).then(c => {
                        this.chapters = c;
                        if(this.chapters.length > 0){
                            let n = Math.ceil(this.chapters.length / 10);
                            for(let i = 0; i < n; i++) this.paginator.push(i);
                        }
                    }).catch(() => {
                        this.isError.generalLoad = true;
                        this.mensajeError = "Los capítulos están corruptos.";
                    });
                }
            }).catch(() => {
                this.isError.generalLoad = true;
                this.mensajeError = "Error en el servidor.";
            });
        });
    }
    getImage(imageUrl: string): string{
        return "https://i1.wp.com/bmanga.net/" + imageUrl;
    }
    getSizeImageCard(imageUrl: string): string{
        return this.getImage(imageUrl) + '?w=200';
    }
    now(): string{
        let x = new Date();
        let month: any = x.getMonth() + 1;
        if(month < 10) month = "0" + month;
        return (x.getFullYear() + '-' + month + '-' + x.getDate()).toString();
    }
    changePage(index: number): void{
        this.page = index;
    }
    lectura(id: number): void{
        this.router.navigate(['/leer', id.toString(16)]);
    }
    makeSnack(msg: string, t?: number): void{
        this.snack.open(msg, null, { duration: t | 2500 });
    }
    getData(data: Array<any>): Array<any>{
        let inicio = this.page * 10;
        let final = ((this.page + 1) * 10) - 1;
        try{
            let nArray: Array<any> = [];
            for(let i = inicio; i <= final; i++) nArray.push(data[i]);
            return nArray;
        }catch(ex){
            return [];
        }
    }
}