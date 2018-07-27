import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisqusModule } from 'ngx-disqus';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { LeerComponent } from './leer/leer.component';
import { LoginComponent } from './usuarios/login/login.component';
import { CpanelAdminComponent } from './usuarios/cpanel-admin/cpanel-admin.component';
import { CpanelUserComponent } from './usuarios/cpanel-user/cpanel-user.component';
import { BuscarComponent } from './buscar/buscar.component';
import { ConfigComponent } from './modals/config/config.component';
import { DownloadComponent } from './download/download.component';
import { SimpleComponent } from './modals/simple/simple.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'biblioteca/:nombre', component: BibliotecaComponent },
    { path: 'leer/:id', component: LeerComponent },
    { path: 'login', component: LoginComponent },
    { path: '@dashboard', children: [
        { path: 'admin', component: CpanelAdminComponent },
        { path: 'me', component: CpanelUserComponent }
    ] },
    { path: 'buscar', component: BuscarComponent },
    { path: 'descargar', component: DownloadComponent, children: [
        { path: ':id', component: DownloadComponent }
    ] },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ErrorComponent,
        BibliotecaComponent,
        LeerComponent,
        LoginComponent,
        CpanelAdminComponent,
        CpanelUserComponent,
        BuscarComponent,
        ConfigComponent,
        DownloadComponent,
        SimpleComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        HttpModule,
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        DisqusModule.forRoot('mangabooombin')
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        ConfigComponent,
        SimpleComponent
    ]
})
export class AppModule { }