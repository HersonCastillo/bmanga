import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})
export class CapitulosService {
  constructor(private globals: GlobalService, private http: Http) { }
  public ultimosCapitulos(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.get(this.globals.API + "capitulos/ultimos")
      .subscribe(r => resolve(r.json()), err => reject(err));
    });
  }
}
