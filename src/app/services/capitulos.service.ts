import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CapitulosService {
    constructor(
        private globals: GlobalService, 
        private http: Http,
        private httpClient: HttpClient
    ) { }
    public indexInfo(): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.get(this.globals.API + 'index')
            .subscribe(r => rs(r.json()), e => rj(e));
        });
    }
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
    public getImagesSubscribe(dir: string, n: number): Observable<any>{
        return this.httpClient.post(this.globals.API + "capitulos/lectura/images", {
            dir: dir,
            n: n
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
        return this.http.post(this.globals.API + 'download', {
            id: id
        });
    }
    public multipleDownloads(ids: string, name: string): Observable<any>{
        return this.http.post(this.globals.API + 'downloads', {
            ids: ids,
            nombre: name
        });
    }
    public infoDownload(id: any): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'donwload_info', {
                id: id
            }).subscribe(r => rs(r.json()), e => rj(e));
        });
    }
}