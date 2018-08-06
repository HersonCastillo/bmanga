import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmComponent, SimpleComponent } from '../../../modals/modal';

import * as $ from'jquery';
import 'jquery-form';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
@Component({
    selector: 'app-manga',
    templateUrl: './manga.component.html',
    styleUrls: ['./manga.component.css'],
    animations: []
})
export class MangaComponent implements OnInit {
    constructor(
        private admin: AdminService,
        private snack: MatSnackBar,
        private dialog: MatDialog
    ){}
    public mangas: Array<any> = [];
    public gens = ["romance", "horror", "escolar", "yuri", "accion", "ficcion", "yaoi", "trajedia", "desconocido",
"piscologico", "misterio", "suspenso", "drama","deportes", "ecchi", "hentai", "sobrenatural", "comedia", 
"fantasia"];
    public generos = {
        release: ""
    }
    public inForm = {
        nombre: "",
        sinopsis: ""
    }
    public estado = "A";
    public url: string = this.admin.urlToAddBook;
    public matcher = new MyErrorStateMatcher();
    public uploading: boolean = false;
    public valueUpload: number = 0;
    public form = {
        nombre: new FormControl('', [Validators.required]),
        sinopsis: new FormControl('', [Validators.required])
    }
    confirm(title: string, message: string, fs: Function, fe?: Function): void{
        ConfirmComponent.confirm = () => {
            fs();
            this.dialog.closeAll();
        }
        ConfirmComponent.close = () => {
            if(fe) fe();
            this.dialog.closeAll();
        }
        ConfirmComponent.title = title;
        ConfirmComponent.message = message;
        this.dialog.open(ConfirmComponent);
    }
    simple(title: string, message: string): void{
        SimpleComponent.close = () => this.dialog.closeAll();
        SimpleComponent.title = title;
        SimpleComponent.message = message;
        this.dialog.open(SimpleComponent);
    }
    makeSnack(txt: string, t?: number): void{
        this.snack.open(txt, null, {duration: t||2000});
    }
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Agregar manga | BMANGA');
    }
    submit(): void{
        if(
            !this.form.nombre.hasError('required') &&
            !this.form.sinopsis.hasError('required')
        ){
            if(this.generos.release.length >= 1){
                if($('#imageReference').val()){
                    this.confirm('Subiendo manga', '¿Estas seguro de que lo quieres subir ya?', () => {
                        let env = (<any>$(".submitForm"));
                        env.ajaxSubmit({
                            beforeSubmit: (): any => {
                                this.uploading = true;
                            },
                            uploadProgress: (event, position, total, percent) => {
                                this.valueUpload = percent;
                            },
                            success: (data) => {
                                this.uploading = false;
                                this.valueUpload = 0;
                                this.estado = "A";
                                this.inForm.nombre = "";
                                this.inForm.sinopsis = "";
                                this.allFalse();
                                this.simple('¡Perfecto!', 'Manga agregado con éxito en la biblioteca');
                            },
                            error: () => {
                                this.uploading = false;
                                this.valueUpload = 0;
                                this.simple('¡Ups!', 'Ocurrió un error al intentar guardar el manga. Verifica los datos que has completado.');
                            },
                            resetForm: false
                        });
                    });
                } else this.makeSnack("Espera, ¿y la imagen? aún te falta por completar.");
            } else this.makeSnack('¿Y el género?');
        } else this.makeSnack('Aún tienes campos que rellenar.');
    }
    changeGen(): void{
        let result = "";
        this.gens.forEach((val, ind) => {
            if(this.generos[val]){
                let name: any = val.charAt(0).toUpperCase() + val.slice(1);
                result += name + " ";
            }
        });
        this.generos.release = result;
        this.generos.release = this.generos.release.trim();
    }
    allFalse(): void{
        this.gens.forEach(val => {
            if(this.generos[val] != undefined) this.generos[val] = false;
        });
        this.generos.release = "";
    }
    readyToUp(str: string): string{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
