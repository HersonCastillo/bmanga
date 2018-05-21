import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from './global.service';
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
}
