import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import * as $ from 'jquery';
@Component({
    selector: 'app-mangas-all',
    templateUrl: './mangas-all.component.html',
    styleUrls: ['./mangas-all.component.css'],
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
export class MangasAllComponent implements OnInit {
    constructor(
        private admin: AdminService
    ){}
    public mangas: Array<any> = [];
    public hasError: boolean = false;
    public isLoaded: boolean = false;
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Mangas | BMANGA');
        this.admin.mangasAll().then(d => {
            this.isLoaded = true;
            this.hasError = false;
            this.mangas = d;
        }).catch(() => {
            this.hasError = true;
            this.isLoaded = true;
        });
    }
    reduce(txt: string, n: number): string{
        if(txt.length <= n) return txt;
        else return txt.slice(0, n - 1) + "...";
    }
}
