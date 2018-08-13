import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor() { }
    public API: string = "https://bmanga.net/engine/public/";
    public API_COMPRESS: string = "https://bmanga.net/zip/cdn/compress.php";
    //public API: string = "/engine/public/";
    //public API_COMPRESS: string = "/zip/cdn/compress.php";
}
