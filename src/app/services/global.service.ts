import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor() {}
    //public API: string = "https://bmanga.net/engine/public/";
    public API: string = "/engine/public/";
}
