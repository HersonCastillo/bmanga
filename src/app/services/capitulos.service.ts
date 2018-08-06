import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CapitulosService {
    constructor(private globals: GlobalService, private http: Http) { }
    public ultimosCapitulos(): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "capitulos/ultimos")
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public otrosCapitulos(): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "capitulos/otros")
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public getCapitulos(id: number): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.globals.API + "capitulos/" + id)
            .subscribe(r => resolve(r.json()), err => reject(err));
        });
    }
    public infoLectura(id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.get(this.globals.API + "capitulos/lectura/" + id)
            .subscribe(r => rs(r.json()), err => rj(err));
        });
    }
    public getImages(dir: string, n: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + "capitulos/lectura/images", {
                dir: dir,
                n: n
            }).subscribe(r => rs(r.json()), err => rj(err));
        });
    }
    public getImagesCount(dir: string): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + "capitulos/lectura/images/count", {
                dir: dir
            }).subscribe(r => rs(r.json()), err => rj(err));
        });
    }
    public descargar(id: any): Observable<any>{
        return this.http.post(this.globals.API_COMPRESS + '?r=' + id, {});
    }
}