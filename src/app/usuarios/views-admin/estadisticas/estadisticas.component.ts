import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import * as $ from 'jquery';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
declare var Chart: any;
@Component({
    selector: 'app-estadisticas',
    templateUrl: './estadisticas.component.html',
    styleUrls: ['./estadisticas.component.css'],
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
export class EstadisticasComponent implements OnInit {
    constructor(
        private admin: AdminService
    ){}
    public estadisticas: any = {};
    public hasError: boolean = false;
    public isLoaded: boolean = false;
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Estadísticas | BMANGA');
        this.admin.estadisticas().then(d => {
            this.isLoaded = true;
            this.hasError = false;
            this.estadisticas = d;
            this.draw();
        }).catch(() => {
            this.hasError = true;
            this.isLoaded = true;
        });
    }
    draw(){
        let options = {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            }
        }
        setTimeout(() => {
            try{
                let canvas1 = (<any>document.getElementById("bestMangas"));
                let canvas2 = (<any>document.getElementById("lastUpdates"));
                let canvas3 = (<any>document.getElementById("bestUpdates"));
                canvas1 = canvas1.getContext('2d');
                canvas2 = canvas2.getContext('2d');
                canvas3 = canvas3.getContext('2d');
                let mangas = this.estadisticas.mangas;
                let bestUpdates = this.estadisticas.b_caps;
                let lastUpdates = this.estadisticas.l_caps;
                new Chart(canvas1, {
                    type: 'line',
                    data: {
                        labels: [mangas[0].nombre, 
                                mangas[1].nombre, 
                                mangas[2].nombre, 
                                mangas[3].nombre, 
                                mangas[4].nombre],
                        datasets: [{
                            label: "Mejores mangas (actual)",
                            data: [mangas[0].lecturas, 
                            mangas[1].lecturas, 
                            mangas[2].lecturas, 
                            mangas[3].lecturas, 
                            mangas[4].lecturas],
                            fill: false,
                            lineTension: 0,
                        }]
                    },
                    options: options
                });
                //BestMangas
                new Chart(canvas1, {
                    type: 'line',
                    data: {
                        labels: [mangas[0].nombre, 
                                mangas[1].nombre, 
                                mangas[2].nombre, 
                                mangas[3].nombre, 
                                mangas[4].nombre],
                        datasets: [{
                            label: "Mejores mangas (actual)",
                            data: [mangas[0].lecturas, 
                                mangas[1].lecturas, 
                                mangas[2].lecturas, 
                                mangas[3].lecturas, 
                                mangas[4].lecturas],
                            fill: false,
                            lineTension: 0,
                        }]
                    },
                    options: options
                });
                //LastUpdates
                new Chart(canvas2, {
                    type: 'bar',
                    data: {
                        labels: [lastUpdates[0].nombre + " " + lastUpdates[0].capitulo, 
                                lastUpdates[1].nombre + " " + lastUpdates[1].capitulo, 
                                lastUpdates[2].nombre + " " + lastUpdates[2].capitulo, 
                                lastUpdates[3].nombre + " " + lastUpdates[3].capitulo, 
                                lastUpdates[4].nombre + " " + lastUpdates[4].capitulo,
                                lastUpdates[5].nombre + " " + lastUpdates[5].capitulo,
                                lastUpdates[6].nombre + " " + lastUpdates[6].capitulo,
                                lastUpdates[7].nombre + " " + lastUpdates[7].capitulo,
                                lastUpdates[8].nombre + " " + lastUpdates[8].capitulo,
                                lastUpdates[9].nombre + " " + lastUpdates[9].capitulo],
                        datasets: [{
                            label: "Últimas actualizaciones",
                            data: [lastUpdates[0].vistas, 
                                lastUpdates[1].vistas, 
                                lastUpdates[2].vistas, 
                                lastUpdates[3].vistas, 
                                lastUpdates[4].vistas,
                                lastUpdates[5].vistas,
                                lastUpdates[6].vistas,
                                lastUpdates[7].vistas,
                                lastUpdates[8].vistas,
                                lastUpdates[9].vistas],
                            fill: false,
                            lineTension: 0,
                        }]
                    },
                    options: options
                });
                //BestUpdates
                new Chart(canvas3, {
                    type: 'bar',
                    data: {
                        labels: [bestUpdates[0].nombre + " " + bestUpdates[0].capitulo, 
                                bestUpdates[1].nombre + " " + bestUpdates[1].capitulo, 
                                bestUpdates[2].nombre + " " + bestUpdates[2].capitulo, 
                                bestUpdates[3].nombre + " " + bestUpdates[3].capitulo, 
                                bestUpdates[4].nombre + " " + bestUpdates[4].capitulo,
                                bestUpdates[5].nombre + " " + bestUpdates[5].capitulo,
                                bestUpdates[6].nombre + " " + bestUpdates[6].capitulo,
                                bestUpdates[7].nombre + " " + bestUpdates[7].capitulo,
                                bestUpdates[8].nombre + " " + bestUpdates[8].capitulo,
                                bestUpdates[9].nombre + " " + bestUpdates[9].capitulo],
                        datasets: [{
                            label: "Las mejores subidas en el sitio",
                            data: [bestUpdates[0].vistas, 
                                bestUpdates[1].vistas, 
                                bestUpdates[2].vistas, 
                                bestUpdates[3].vistas, 
                                bestUpdates[4].vistas,
                                bestUpdates[5].vistas,
                                bestUpdates[6].vistas,
                                bestUpdates[7].vistas,
                                bestUpdates[8].vistas,
                                bestUpdates[9].vistas],
                            fill: false,
                            lineTension: 0,
                        }]
                    },
                    options: options
                });
            }catch(ex){
                console.warn("No se encuenta el contexto indicado en la vista.");
            }
        }, 1);
    }
}
