import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SimpleComponent } from '../../modals/modal';
import * as $ from 'jquery';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
        private loginProvider: LoginService,
        private snack: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ){}
    ngOnInit() {
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Inicia sesión en tu cuenta de BMANGA');
    }
    public credentials = {
        user: "",
        pass: ""
    }
    private isLoading: boolean = false;
    login(): void{
        if(this.credentials.user && this.credentials.pass){
            this.isLoading = true;
            this.loginProvider.login(this.credentials.user, this.credentials.pass).then(r => {
                if(r.success){
                    if(r.status == 1){
                        this.makeSnack("Bienvenido " + this.credentials.user, 3500);
                        localStorage.setItem('b_token', r._token);
                        if(r.type === 1) this.router.navigate(['/@dashboard', 'admin']);
                        else if(r.type === 2) this.router.navigate(['/@dashboard', 'me']);
                        else{
                            this.simple('Mmm...', 'Tipo de usuario no válido.');
                            this.isLoading = false;
                        }
                    }else if(r.status == 2){
                        this.simple('¡Ups!', 'Tu cuenta esta cerrada temporalmente.');
                        this.makeSnack("No puedes acceder aún.");
                        this.isLoading = false;
                    } else if(r.status == 3){
                        this.simple('¡Ups!', 'Tu cuenta esta cerrada permanentemente.');
                        this.makeSnack("No puedes acceder.");
                        this.isLoading = false;
                    }
                } else if(r.error){
                    this.simple('¡Muy mal!', r.error || 'No se puede iniciar sesión en estos momentos.');
                    this.isLoading = false;
                }
                else{
                    this.simple('Mmmm...', 'Se encontró un error, pronto lo solucionaremos');
                    this.isLoading = false;
                }
            }).catch(() => {
                this.isLoading = false;
                this.simple('¡Ups!', 'No se pudo iniciar sesión debido a un error en la aplicación.');
            });
        } else this.makeSnack("Campos vacíos.");
    }
    makeSnack(str: string, t?: number): void{
        this.snack.open(str, null, {duration:t||1500});
    }
    simple(title: string, message: string): void{
        SimpleComponent.title = title;
        SimpleComponent.message = message;
        SimpleComponent.close = () => {
            this.dialog.closeAll();
        }
        this.dialog.open(SimpleComponent);
    }
}
