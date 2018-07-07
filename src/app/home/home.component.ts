import { Component, OnInit } from '@angular/core';
import { CapitulosService } from '../services/capitulos.service';
import { LibrosService } from '../services/libros.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(private capitulos: CapitulosService,
    private libros: LibrosService,
    private router: Router) {}
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
    ngOnInit() {
        $("title").text("BMANGA");
        $("body, html").on('contextmenu', function(){
            return false;
        });
        this.capitulos.ultimosCapitulos().then(r => {
            this.capitulosNuevos = r;
            this.isLoad.ultimos = true;
        }).catch(() => {
            this.isLoad.ultimos = true;
            this.isError.ultimos = true;
        });
        this.capitulos.otrosCapitulos().then(r => {
            this.capitulosOtros = r
            this.isLoad.otros = true;
        }).catch(() => {
            this.isLoad.otros = true;
            this.isError.otros = true;
        });
        this.libros.ranking().then(r => {
            this.librosRanking = r;
            this.isLoad.rank = true;
        }).catch(() => {
            this.isLoad.rank = true;
            this.isError.rank = true;
        });
        this.libros.otrasObras(0).then(r => {
            this.libroAzar = r[0];
            this.isLoad.azar = true;
        }).catch(() => {
            this.isLoad.azar = true;
            this.isError.azar = true;
        });
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
}
