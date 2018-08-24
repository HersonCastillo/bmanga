import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { 
    FormControl, 
    FormGroupDirective, 
    NgForm, 
    Validators} 
from '@angular/forms';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
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
    styleUrls: ['./biblioteca.component.css'],
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
export class BibliotecaComponent implements OnInit, OnDestroy {
    constructor(
        private route: ActivatedRoute,
        private libros: LibrosService,
        private capitulos: CapitulosService,
        private suscripcion: SuscripcionesService,
        private snack: MatSnackBar,
        private router: Router
    ) { }
    @ViewChild('selection') public selectToDownload: any;
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
    public url: string = this.router.url || window.location.href;
    public pageId: string;
    private counter: number = 0;
    public isAllLoaded: boolean = false;
    public mensajeError: string = "";
    public emailControl: any = new FormControl('', [
        Validators.required, 
        Validators.email
    ]);
    envEmail(): void{}
    public isDonwloadMultiple: boolean = false;
    /*multipleDownload(): void{
        let nStr = "";
        let val = this.selectToDownload.selectedOptions.selected.length;
        if(val <= 5 && val >= 1){
            this.selectToDownload.selectedOptions.selected.forEach((item, index) => {
                nStr += item.value;
                if(index != val - 1) nStr += ",";
            });
            let nombre = this.mangaInformacion.nombre;
            this.makeSnack("Descargando capítulos, esto puede demorar un poco...", 5000);
            this.isDonwloadMultiple = true;
            this.capitulos.multipleDownloads(nStr, nombre).subscribe(r => {
                window.open(r._body);
                this.isDonwloadMultiple = false;
            });
        } else this.makeSnack("Solo se pueden 5 descargas como máximo.");
    }*/
    ngOnDestroy(){
        this.observable.unsubscribe();
        this.isAllLoaded = false;
        this.counter = 0;
    }
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        this.observable = this.route.params.subscribe(subs => {
            this.paginator = [];
            this.id = subs['nombre'];
            this.isAllLoaded = false;
            this.counter = 0;
            this.pageId = "/leer/" + this.id;
            this.page = 0;
            $("title").text(this.id + " en BMANGA");
            this.libros.bookGet(this.id).then(r => {
                if(r.error){
                    this.isError.generalLoad = true;
                    this.mensajeError = r.error;
                    this.isAllLoaded = true;
                } else {
                    document.getElementsByTagName("html")[0].scroll(0, 0);
                    this.mangaInformacion = r.info;
                    this.mangasSimilares = r.similares;
                    this.otrosMangas = r.random;
                    this.chapters = r.capitulos;
                    this.isAllLoaded = true;
                    if(this.chapters.length > 0){
                        let n = Math.ceil(this.chapters.length / 10);
                        for(let i = 0; i < n; i++) this.paginator.push(i);
                    }
                }
            }).catch(() => {
                this.isError.generalLoad = true;
                this.isAllLoaded = true;
                this.mensajeError = "Error en el servidor.";
            });
        });
    }
    tituloCanBe(str: string): boolean{
        if(str != undefined || str != null){
            if(str == null || str.length == 0) return false;
            return true;
        } 
        return false;
    }
    getImage(imageUrl: string): string{
        if(imageUrl) return "https://i1.wp.com/bmanga.net/" + imageUrl;
        return "assets/img/image-no-load.png";
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
        let final = (this.page + 1) * 10;
        try{
            return this.chapters.slice(inicio, final);
        }catch(ex){
            return [];
        }
    }
    reduce(str: string, num: number): string{
        if(!str) return "";
        if(str.length <= num) return str;
        else return str.slice(0, num - 1) + "...";
    }
    descargar(id: any): void{
        this.makeSnack("Descargando...", 4500);
        this.capitulos.descargar(id.toString(16)).subscribe(response => {
            window.open(response._body);
        }, err => {
            this.makeSnack("Ocurrió un error desconocido... Lo solventaremos luego.");
            this.router.navigate(['/descargar', id.toString(16)]);
        });
    }
}