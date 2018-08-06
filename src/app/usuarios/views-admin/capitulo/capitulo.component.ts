import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as $ from 'jquery';
import 'jquery-form';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmComponent, SimpleComponent } from '../../../modals/modal';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
@Component({
    selector: 'app-capitulo',
    templateUrl: './capitulo.component.html',
    styleUrls: ['./capitulo.component.css']
})
export class CapituloComponent implements OnInit {
    constructor(
        private admin: AdminService,
        private dialog: MatDialog,
        private snack: MatSnackBar
    ){}
    public matcher = new MyErrorStateMatcher();
    private isLoad: boolean = false;
    public mangas: Array<any> = [];
    public url: string = this.admin.urlToAddChapter;
    public form = {
        manga: new FormControl('', [Validators.required]),
        capitulo: new FormControl('', [Validators.required, Validators.min(0), Validators.max(2999)])
    }
    public data = {
        manga: -1,
        capitulo: 0,
        joint: "",
        titulo: ""
    }
    public uploading: boolean = false;
    public valueUpload: number = 0;
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
    ngOnInit(){
        this.admin.mangasAll().then(r => {
            this.mangas = r;
            this.isLoad = true;
        });
    }
    submit(): void{
        if(
            !this.form.manga.hasError('required') &&
            !this.form.capitulo.hasError('min') &&
            !this.form.capitulo.hasError('max') &&
            !this.form.capitulo.hasError('required')
        ){
            if(this.data.manga >= 1){
                if($("#imagesInput").val()){
                    this.confirm('Subir capítulo', '¿Estás seguro de que quieres subir el capítulo ahora?', () => {
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
                                this.data.capitulo++;
                                this.data.titulo = "";
                                this.simple('¡Perfecto!', 'El capítulo fue subido con éxito.');
                            },
                            error: () => {
                                this.uploading = false;
                                this.simple('¡Ups!', 'Ocurrió un problema al subir el capítulo. Verifica los datos que has completado.');
                            },
                            resetForm: false
                        });
                    });
                } else this.makeSnack("Faltan las imágenes");
            } else this.makeSnack('Manga no válido.');
        } else this.makeSnack("Aún faltan campos por compeletar");
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration:n||1500});
    }
}
