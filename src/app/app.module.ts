import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisqusModule } from 'ngx-disqus';
import { LoginGuard, AuthGuardAdmin, AuthGuardUser } from './services/auth.guard';

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
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { PublicacionesComponent } from './usuarios/views-admin/publicaciones/publicaciones.component';
import { MangaComponent } from './usuarios/views-admin/manga/manga.component';
import { CapituloComponent } from './usuarios/views-admin/capitulo/capitulo.component';
import { EstadisticasComponent } from './usuarios/views-admin/estadisticas/estadisticas.component';
import { GrupoComponent } from './usuarios/views-admin/grupo/grupo.component';
import { PermisosComponent } from './usuarios/views-admin/permisos/permisos.component';
import { ConfiguracionComponent } from './usuarios/views-admin/configuracion/configuracion.component';
import { MangasAllComponent } from './usuarios/views-admin/mangas-all/mangas-all.component';
import { EditMangaComponent } from './usuarios/views-admin/edit-manga/edit-manga.component';
import { EditCapituloComponent } from './usuarios/views-admin/edit-capitulo/edit-capitulo.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'biblioteca/:nombre', component: BibliotecaComponent },
    { path: 'leer/:id', component: LeerComponent },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: '@dashboard', children: [
        { path: 'admin', component: CpanelAdminComponent, children: [
            { path: 'publicaciones', component: PublicacionesComponent },
            { path: 'mangas', component: MangasAllComponent },
            { path: 'nuevo', children: [
                { path: 'manga', component: MangaComponent },
                { path: 'capitulo', component: CapituloComponent },
                { path: '**', redirectTo: 'capitulo', pathMatch: 'full' }
            ] },
            { path: 'edit', children: [
                { path: 'manga/:id', component: EditMangaComponent },
                { path: 'capitulo/:id', component: EditCapituloComponent }
            ] },
            { path: 'estadisticas', component: EstadisticasComponent },
            { path: 'grupo', component: GrupoComponent },
            { path: 'permisos', component: PermisosComponent },
            { path: 'configuracion', component: ConfiguracionComponent },
            { path: '**', redirectTo: 'publicaciones', pathMatch: 'full' }
        ], canActivate: [AuthGuardAdmin] },
        { path: 'me', component: CpanelUserComponent, children: [], canActivate: [AuthGuardUser] }
    ] },
    { path: 'buscar', component: BuscarComponent },
    { path: 'descargar/:id', component: DownloadComponent },
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
        SimpleComponent,
        ConfirmComponent,
        PublicacionesComponent,
        MangaComponent,
        CapituloComponent,
        EstadisticasComponent,
        GrupoComponent,
        PermisosComponent,
        ConfiguracionComponent,
        MangasAllComponent,
        EditMangaComponent,
        EditCapituloComponent
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
        DisqusModule.forRoot('mangabooombin'),
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        ConfigComponent,
        SimpleComponent,
        ConfirmComponent
    ]
})
export class AppModule { }