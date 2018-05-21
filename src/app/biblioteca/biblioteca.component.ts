import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { CapitulosService } from '../services/capitulos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private libros: LibrosService,
    private capitulos: CapitulosService,
    private snack: MatSnackBar
  ) { }
  public mangaInformacion: any = {};
  public chapters: Array<any> = [];
  public paginator: Array<number> = [];
  private page: number = 0;
  public email: string = "";
  public isError: any = {
    generalLoad: false
  };
  public mensajeError: string = "";
  envEmail(): void{
    let email = this.email.toString().trim();
    if(email.length > 0){
        console.log('ok')
    } else this.makeSnack("El campo no puede estar vacío.");
  }
  ngOnInit(){
    let id = this.route.snapshot.paramMap.get('nombre');
    this.libros.getLibro(id).then(r => {
      if(r.error){
        this.isError.generalLoad = true;
        this.mensajeError = r.error;
      }
      else {
        this.mangaInformacion = r;
        this.capitulos.getCapitulos(r.id).then(c => {
          this.chapters = c;
          if(this.chapters.length > 0){
            let n = Math.ceil(this.chapters.length / 10);
            for(let i = 0; i < n; i++) this.paginator.push(i);
          }
        }).catch(() => {
          this.isError.generalLoad = true;
          this.mensajeError = "Los capítulos están corruptos.";
        });
      }
    }).catch(() => {
      this.isError.generalLoad = true;
      this.mensajeError = "Error en el servidor.";
    });
  }
  getImage(imageUrl: string): string{
    return "https://i1.wp.com/bmanga.net/" + imageUrl;
  }
  now(): string{
    let x = new Date();
    let month: any = x.getMonth() + 1;
    if(month < 10) month = "0" + month;
    return (x.getFullYear() + '-' + month + '-' + x.getDate()).toString();
  }
  changePage(index: number): void{
    this.page = index;
  }
  makeSnack(msg: string, t?: number): void{
    this.snack.open(msg, null, { duration: t | 2500 });
  }
  getData(data: Array<any>): Array<any>{
    let inicio = this.page * 10;
    let final = ((this.page + 1) * 10) - 1;
    try{
      let nArray: Array<any> = [];
      for(let i = inicio; i <= final; i++) nArray.push(data[i]);
      return nArray;
    }catch(ex){
      return [];
    }
  }
}