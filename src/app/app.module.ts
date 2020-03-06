import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AdminDashbordComponent } from './admin/admin-dashbord/admin-dashbord.component';
import { AlbumComponent } from './album/album.component';
import { ProfilComponent } from './profil/profil.component';
import { AdminProfilComponent } from './admin/admin-profil/admin-profil.component';
import { AdminAlbumsComponent } from './admin/admin-albums/admin-albums.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortablejsModule } from 'ngx-sortablejs';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AdminDashbordComponent,
    AdminProfilComponent,
    AdminAlbumsComponent,
    AlbumComponent,
    ProfilComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SortablejsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
