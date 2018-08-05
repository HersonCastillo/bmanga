import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: Http,
        private globals: GlobalService
    ){ }
    public login(email: string, pass: string): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'login', {
                email: email,
                pass: pass
            }).subscribe(r => rs(r.json()), err => rj(err));
        });
    }
    public validate(): Observable<any>{
        let token = localStorage.getItem('b_token');
        return this.http.post(this.globals.API + 'validate', {
            token
        });
    }
}
