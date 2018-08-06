import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { Http } from '@angular/http';
@Injectable({
    providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
    constructor(
        private router: Router,
        private globals: GlobalService,
        private http: Http
    ){}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try{
            return new Promise<boolean>((rs, rj) => {
                let token = localStorage.getItem('b_token');
                if(token == null){
                    rs(false);
                    this.router.navigate(['login']);
                } else {
                    this.http.post(this.globals.API + 'validate', { token: token })
                    .subscribe(r => {
                        let dr: any = r.json();
                        if(dr.success && dr.status && dr.tipo == 1) rs(true);
                        else{
                            rs(false);
                            this.router.navigate(['login']);
                        }
                    }, () => {
                        rs(false)
                        this.router.navigate(['login']);
                    });
                }
            });
        }catch(ex){
            return new Promise<boolean>((rs, rj) => {
                rs(false);
                this.router.navigate(['login']);
            });
        }
    }
}
@Injectable({
    providedIn: 'root'
})
export class AuthGuardUser implements CanActivate {
    constructor(
        private router: Router,
        private globals: GlobalService,
        private http: Http
    ){}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try{
            return new Promise<boolean>((rs, rj) => {
                let token = localStorage.getItem('b_token');
                if(token == null){
                    rs(false);
                    this.router.navigate(['login']);
                } else {
                    this.http.post(this.globals.API + 'validate', { token: token })
                    .subscribe(r => {
                        let dr: any = r.json();
                        if(dr.success && dr.status && dr.tipo == 2) rs(true);
                        else{
                            rs(false);
                            this.router.navigate(['login']);
                        }
                    }, () => {
                        rs(false)
                        this.router.navigate(['login']);
                    });
                }
            });
        }catch(ex){
            return new Promise<boolean>((rs, rj) => {
                rs(false);
                this.router.navigate(['login']);
            });
        }
    }
}
@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate{
    constructor(
        private globals: GlobalService,
        private router: Router,
        private http: Http
    ){}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try{
            return new Promise<boolean>((rs, rj) => {
                let token = localStorage.getItem('b_token');
                if(token == null) rs(true);
                else {
                    this.http.post(this.globals.API + 'validate', { token: token })
                    .subscribe(r => {
                        let dr: any = r.json();
                        if(dr.success && dr.status && (dr.tipo == 1 || dr.tipo == 2)){
                            rs(false);
                            this.router.navigate(['/@dashboard','admin']);
                        } else rs(true);
                    }, () => {
                        rs(true);
                    });
                }
            });
        }catch(ex){
            return new Promise<boolean>((rs, rj) => {
                rs(true);
            });
        }
    }
}
