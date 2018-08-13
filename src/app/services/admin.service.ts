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
    public mangasAll(): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.get(this.globals.API + 'libros')
            .subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public get urlToAddBook(){
        return this.globals.API + 'libros/new?token=' + localStorage.getItem('b_token');
    }
    public get urlToAddChapter(){
        return this.globals.API + 'capitulos/new?token=' + localStorage.getItem('b_token');
    }
    public editBook(id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + "libros/info?token=" + localStorage.getItem('b_token'), {
                id: id
            }).subscribe(r => {
                try{
                    rs(r.json())
                }catch(ex){
                    rj(null);
                }
            }, e => rj(e));
        });
    }
    public editChapter(id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'capitulos/info?token=' + localStorage.getItem('b_token'), {
                id: id
            }).subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public editInfoChapter(data: any): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'capitulos/edit/info?token=' + localStorage.getItem('b_token'), data)
            .subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public editInfoBook(data: any): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'libros/edit/info?token=' + localStorage.getItem('b_token'), data)
            .subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public get urlToEditImageBook(){
        return this.globals.API + 'libros/edit/image?token=' + localStorage.getItem('b_token');
    }
    public deleteChapter(id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'capitulos/delete?token=' + localStorage.getItem('b_token'), {
                id: id
            }).subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public deleteManga(id: number): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'libros/delete?token=' + localStorage.getItem('b_token'), {
                id: id
            }).subscribe(r => rs(r.json()), e => rj(e));
        });
    }
    public uploadImage(file: File, carpeta): Promise<any>{
        return new Promise<any>((rs, rj) => {
            if(localStorage.getItem('b_token')){
                let formData = new FormData();
                formData.append('image', file);
                this.http.post(this.globals.API + 'capitulos/image?into=' + carpeta, formData)
                .subscribe(r => rs(r.json()), err => rj(err));
            } else rj(null);
        });
    }
    public newChapter(data: any): Promise<any>{
        return new Promise<void>((rs, rj) => {
            this.http.post(this.globals.API + 'capitulos/new?token=' + localStorage.getItem('b_token'), data)
            .subscribe(r => rs(r.json()), e => rj(e));
        });
    }
}
