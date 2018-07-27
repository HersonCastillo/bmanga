import { Component, OnInit } from '@angular/core';
import { LibrosService } from '../services/libros.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as $ from 'jquery';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.css'],
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
export class BuscarComponent implements OnInit {
    constructor(
        private librosProvider: LibrosService,
        private router: Router,
        private snack: MatSnackBar
    ) { }
    public search: string;
    public inOffert: any = {};
    public control = new FormControl();
    public data: Array<any> = [];
    public filteredOptions: Observable<any>;
    public isAllLoaded: boolean = false;
    public errorData: boolean = false;
    public selected: string;
    public pageEvent: PageEvent;
    public pageSizeOptions: number[] = [5, 10, 25, 100];
    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
    getData(): Array<any>{
        let d = this.data;
        let nArr: Array<any> = [];
        if(this.pageEvent){
            for(let i = (this.pageEvent.pageIndex * this.pageEvent.pageSize), j = 0; i < (this.pageEvent.pageIndex * this.pageEvent.pageSize) + this.pageEvent.pageSize; i++, j++)
            nArr[j] = d[i];
        }
        else{
            for(let i = 0, j = 0; i <  10; i++, j++)
            nArr[j] = d[i];
        }
        return nArr;
    }
    makeSnack(txt: string, t?: number): void{
        this.snack.open(txt, null, { duration: t || 1500 });
    }
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Buscar manga en BMANGA');
        this.filteredOptions = this.control.valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filter(value) : this.data.slice())
        );
        this.librosProvider.getAll().then(r => {
            this.data = r;
            this.isAllLoaded = true;
        }).catch(() => {
            this.errorData = true;
            this.isAllLoaded = true;
        });
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.data.filter(option => option.nombre.toLowerCase().includes(filterValue));
    }
    getImage(imageUrl: string): string{
        return this.getNormalImage(imageUrl) + "?w=80";
    }
    getNormalImage(imageUrl: string): string{
        return "https://i1.wp.com/bmanga.net/" + imageUrl;
    }
    change(): void{
        this.search = this.selected;
        let nArr;
        this.data.forEach(el => {
            if(el.nombre == this.search) nArr = el;
        });
        this.inOffert = nArr;
    }
    reduce(str: string, n: number): string{
        if(str == undefined) return "Recurso no recuperado.";
        if(str.length <= n) return str;
        else return str.slice(0, n - 1) + "...";
    }
}
