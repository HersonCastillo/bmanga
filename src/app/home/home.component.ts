import { Component, OnInit, OnDestroy } from '@angular/core';
import { CapitulosService } from '../services/capitulos.service';
import { LibrosService } from '../services/libros.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [trigger('popOverState', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.95, .95)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor(private capitulos: CapitulosService,
    private libros: LibrosService,
    private router: Router,
    private snack: MatSnackBar) {}
    public capitulosNuevos: Array<any> = [];
    public capitulosOtros: Array<any> = [];
    public librosRanking: Array<any> = [];
    public libroAzar = {};
    public positionTooltip: string = "above";
    public isLoad = {
        ultimos: false,
        otros: false,
        rank: false,
        azar: false
    };
    public isError = {
        ultimos: false,
        otros: false,
        rank: false,
        azar: false
    };
    public isAllLoaded: boolean = false;
    private counter: number = 0;
    ngOnInit() {
        $("title").text("BMANGA");
        $("body, html").on('contextmenu', function(){
            return false;
        });
        this.capitulos.ultimosCapitulos().then(r => {
            this.capitulosNuevos = r;
            this.isLoad.ultimos = true;
            this.counter++;
            if(this.counter == 4)
                this.isAllLoaded = true;
        }).catch(() => {
            this.isLoad.ultimos = true;
            this.isError.ultimos = true;
            this.isAllLoaded = true;
        });
        this.capitulos.otrosCapitulos().then(r => {
            this.capitulosOtros = r
            this.isLoad.otros = true;
            this.counter++;
            if(this.counter == 4)
                this.isAllLoaded = true;
        }).catch(() => {
            this.isLoad.otros = true;
            this.isError.otros = true;
            this.isAllLoaded = true;
        });
        this.libros.ranking().then(r => {
            this.librosRanking = r;
            this.isLoad.rank = true;
            this.counter++;
            if(this.counter == 4)
                this.isAllLoaded = true;
        }).catch(() => {
            this.isLoad.rank = true;
            this.isError.rank = true;
            this.isAllLoaded = true;
        });
        this.libros.otrasObras(0).then(r => {
            this.libroAzar = r[0];
            this.isLoad.azar = true;
            this.counter++;
            if(this.counter == 4)
                this.isAllLoaded = true;
        }).catch(() => {
            this.isLoad.azar = true;
            this.isError.azar = true;
            this.isAllLoaded = true;
        });
    }
    ngOnDestroy(): void{
        this.isAllLoaded = false;
        this.counter = 0;
    }
    getImage(imageUrl: string): string{
        return "https://i1.wp.com/bmanga.net/" + imageUrl;
    }
    getThumbImage(imageUrl: string): string{
        return "https://i1.wp.com/bmanga.net/" + imageUrl + "?w=60&h=100";
    }
    getName(name: string): string{
        name = name.toString();
        if(name.length <= 15) return name;
        let nName: string = "";
        for(let i = 0; i < 15; i++) nName += name[i];
        nName += "...";
        return nName;
    }
    elipsis(str: string, num: number): string{
        str = str.toString();
        if(str.length <= num) return str;
        else return str.slice(0, num - 1) + "...";
    }
    irManga(nombre: string): void{
        this.router.navigateByUrl('/biblioteca/' + nombre);
    }
    leer(el: any): void{
        let id = el.toString(16);
        this.router.navigate(['/leer', id]);
    }
    download(id: any){
        this.makeSnack("Descargando...", 4500);
        this.capitulos.descargar(id.toString(16)).subscribe(response => {
            let url = "http:" + response._body;
            window.open(url);
        }, err => {
            this.makeSnack("Ocurrió un error desconocido... Lo solventaremos luego.");
            this.router.navigate(['/descargar', id.toString(16)]);
        });
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration: n||1500});
    }
}
