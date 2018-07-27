import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../modals/modal';
import { MatSnackBar, MatDialog } from '@angular/material';
@Component({
    selector: 'usuarios/cpanel-admin',
    templateUrl: './cpanel-admin.component.html',
    styleUrls: ['./cpanel-admin.component.css']
})
export class CpanelAdminComponent {
    isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private snack: MatSnackBar,
        private dialog: MatDialog
    ){}
    closeSession(){
        this.confirm('¡Espera un momento!', '¿Estas seguro de que quieres cerrar sesión ahora?', () => {
            localStorage.removeItem('b_token');
            this.router.navigate(['/']);
            this.makeSnack("¡Esperamos verte pronto otra vez!");
        });
    }
    confirm(title: string, message: string, fs: Function, fe?: Function): void{
        ConfirmComponent.title = title;
        ConfirmComponent.message = message;
        ConfirmComponent.confirm = () => {
            fs();
            this.dialog.closeAll();
        };
        if(fe) ConfirmComponent.close = () => {
            fe();
            this.dialog.closeAll();
        }
        else ConfirmComponent.close = () => this.dialog.closeAll();
        this.dialog.open(ConfirmComponent);
    }
    makeSnack(msg: string, t?: number): void{
        this.snack.open(msg, null, {duration:t||1500});
    }
}
