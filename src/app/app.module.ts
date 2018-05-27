import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { LeerComponent } from './leer/leer.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'biblioteca/:nombre', component: BibliotecaComponent },
  { path: 'leer/:id', component: LeerComponent },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    BibliotecaComponent,
    LeerComponent
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
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }