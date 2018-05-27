import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Http } from '@angular/http';
@Injectable({
    providedIn: 'root'
})
export class SuscripcionesService {
    constructor(
        private globals: GlobalService,
        private http: Http
    ) { }
    public sendSuscripcion(email: string, id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + "suscripciones", {
                email: email,
                id: id
            }).subscribe(r => rs(r.json()), err => rj(err));
        });
    }
}
