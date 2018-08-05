import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from './global.service';
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(
        private http: Http,
        private globals: GlobalService
    ) { }
    public publicaciones(): Promise<any>{
        return new Promise<void>((rs, rj) => {
            let token = localStorage.getItem('b_token');
            if(token){
                this.http.post(this.globals.API + 'admin/publicaciones', {
                    token: token
                })
                .subscribe(r => rs(r.json()), e => rj(e));
            } else rj(null);
        });
    }
    public estadisticas(): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + 'admin/estadisticas')
            .subscribe(r => resolve(r.json()), e => reject(e));
        });
    }
}
