import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as $ from 'jquery';
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
    public images: Array<File> = [];
    public lastImage: number = 0;
    public uploading: boolean = false;
    public uploadingData: boolean = false;
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
    setImages($e: any): void{
        this.images = <Array<File>> $e.target.files;
    }
    ngOnInit(){
        this.admin.mangasAll().then(r => {
            this.mangas = r;
            this.isLoad = true;
        });
    }
    getPercent(d: number): void{
        let val = d / this.lastImage;
        this.valueUpload = Math.round(val * 100);
    }
    getVal(): number{
        return this.valueUpload;
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
                        let nArray = [];
                        for(let i = 0; i < this.images.length; i++){
                            if(this.images[i]){
                                let element = this.images[i];
                                nArray.push(element);
                            } else break;
                        }
                        this.uploadingData = true;
                        this.admin.newChapter(this.data).then(res => {
                            this.uploadingData = false;
                            if(res.success){
                                this.uploading = true;
                                let carpeta = res.carpeta;
                                this.upload(nArray, carpeta);
                            } else {
                                if(res.error) this.simple("Error", res.error || "No se puede subir el capítulo.");
                                this.makeSnack("Comprueba los datos ingresados.");
                            }
                        }).catch(err => {
                            this.simple('¡Ups!', 'Ocurrió un error como respuesta del servidor, envía un reporte al técnico encargado.');
                            this.uploading = false;
                            this.uploadingData = false;
                            this.images = [];
                        });
                    });
                } else this.makeSnack("Faltan las imágenes");
            } else this.makeSnack('Manga no válido.');
        } else this.makeSnack("Aún faltan campos por compeletar");
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration:n||1500});
    }
    upload(data: any, carpeta: string): void{
        var errorCount: number = 0;
        var warningCount: number = 0;
        var normalCount: number = 0;
        var count: number = 0;
        this.lastImage = this.images.length;
        var image: number = 0;
        let upSystem = () => {
            this.admin.uploadImage(data[image], carpeta).then(ires => {
                count++;
                this.getPercent(count);
                if(ires.success && ires.status == 200) normalCount++;
                else if(ires.success && ires.status == 20) warningCount++;
                else errorCount++;
                if(count == this.lastImage){
                    this.uploading = false;
                    if(this.images.length == normalCount){
                        this.simple("¡Perfecto!", "Imágenes subidas con éxito.");
                        this.data.capitulo++;
                        this.data.titulo = "";
                        this.data.joint = "";
                    }else {
                        if(warningCount > 0) this.simple("¡Cuidado!", "Puede que alguna imagen no se haya guardado correctamente.");
                        if(errorCount > 0) this.simple("¡Error!", "Varias, pocas o todas las imágenes no se pudieron subir.");
                    }
                    return;
                }
                if(++image != undefined) upSystem();
            }).catch(() => {
                errorCount++;
            });
        }
        if(image != this.images.length)
            upSystem();
    }
}
