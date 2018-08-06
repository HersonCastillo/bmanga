import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import {
    trigger,
    transition,
    style,
    animate,
    state
} from '@angular/animations';
import { MatSnackBar, MatDialog } from '@angular/material';
import * as $ from 'jquery';
import 'jquery-form';
@Component({
    selector: 'app-edit-manga',
    templateUrl: './edit-manga.component.html',
    styleUrls: ['./edit-manga.component.css'],
    animations: [trigger('popOverState', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.99, .99)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
})
export class EditMangaComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private admin: AdminService,
        private dialog: MatDialog,
        private snack: MatSnackBar,
        private router: Router
    ) {}
    public isLoad: boolean = false;
    public isError: boolean = false;
    public model = {
        estado: "A",
        nombre: "",
        sinopsis: "",
        image: "",
        generos: "",
        id: -1
    }
    public url: string = this.admin.urlToEditImageBook;
    public infoMod: boolean = false;
    public uploading: boolean = false;
    public valueUpload: number = 0;
    ngOnInit(){
        this.route.params.subscribe(parm => {
            let id = parm['id'];
            this.admin.editBook(id).then(data => {
                if(data.error){
                    this.makeSnack("Ocurrió un error al obtener la información del manga.");
                    this.router.navigate(['/@dashboard','admin']);
                    return;
                }
                this.isError = false;
                this.isLoad = true;
                this.model.nombre = data.nombre;
                this.model.sinopsis = data.sinopsis;
                this.model.estado = data.estado;
                this.model.image = data.imagen;
                this.model.generos = data.generos;
                this.model.id = data.id;
            }).catch(() => {
                this.isLoad = true;
                this.isError = true;
            });
        });
    }
    getImage(imageUrl: string): string{
        if(imageUrl) return "https://i1.wp.com/bmanga.net/" + imageUrl;
        return "assets/img/image-no-load.png";
    }
    submitInfo(): void{
        this.model.nombre = this.model.nombre.trim();
        this.model.sinopsis = this.model.sinopsis.trim();
        if(this.model.nombre.length >= 1 && this.model.sinopsis.length >= 1){
            this.infoMod = true;
            this.admin.editInfoBook(this.model).then(d => {
                this.infoMod = false;
                if(d.success) this.makeSnack(d.success || "Manga actualizado");
                else this.makeSnack(d.error || "Ocurrió un error al actualizar", 3000);

                if(d.error) this.router.navigate(['/@dashboard','admin']);
            }).catch(() => {
                this.makeSnack('Ocurrió un error al guardar la información, intentelo más tarde.');
                this.router.navigate(['/@dashboard','admin']);
                this.infoMod = false;
            });
        } else this.makeSnack("Algunos campos no son válidos.");
    }
    submitImage(): void{
        if($("#imageSend").val()){
            let env = (<any>$(".imageEdit"));
            env.ajaxSubmit({
                beforeSubmit: (): any => {
                    this.uploading = true;
                },
                uploadProgress: (event, position, total, percent) => {
                    this.valueUpload = percent;
                },
                success: (data) => {
                    if(data.route) this.model.image = data.route;
                    this.uploading = false;
                    this.valueUpload = 0;
                    this.makeSnack('Imagen del manga editado con éxito');
                },
                error: () => {
                    this.uploading = false;
                    this.valueUpload = 0;
                    this.makeSnack('Ocurrió un error al intentar editar la imagen del manga', 3000);
                }
            });
        } else this.makeSnack("Aún no hay una imagen seleccionada");
    }
    makeSnack(txt: string, n?: number): void{
        this.snack.open(txt, null, {duration: n||1500});
    }
}
