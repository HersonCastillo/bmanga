import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Http } from '@angular/http';
@Injectable({
    providedIn: 'root'
})
export class LibrosService {
    constructor(private globals: GlobalService, private http: Http) { }
    public ranking(): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "libros/rank")
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public getLibro(nombre: string): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "libros/" + nombre)
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public obrasSimilares(generos: string, id: number): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.post(this.globals.API + "libros/similares", {
                generos: generos,
                id: id
            }).subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public otrasObras(id: number): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "libros/random/" + id)
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
}
