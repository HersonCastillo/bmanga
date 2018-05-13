import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }
  private Global: string = "http://localhost/engine/public/";
  public PATH = {
    GET: {
      
    },
    POST: {

    },
    DELETE: {

    },
    PUT: {
      
    }
  };
}
