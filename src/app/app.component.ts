import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router
    ){}
    ngOnInit(): void{
        $("body, html").on('contextmenu', function(){
			return false;
        });
        setInterval(() => {
            window.location.reload();
        }, 6e5);
        setInterval(() => {
            $.get('/engine/public/delete.php').always(() => {
                console.info("Cache was deleted.");
            });
        }, 15e5);
    }
    goTo(url: string): void{
        this.router.navigate([url]);
    }
}