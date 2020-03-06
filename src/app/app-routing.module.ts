import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminDashbordComponent } from './admin/admin-dashbord/admin-dashbord.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { AlbumComponent } from './album/album.component';
import { ProfilComponent } from './profil/profil.component';
import { AdminProfilComponent } from './admin/admin-profil/admin-profil.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin/dashbord', canActivate: [AuthGuardService], component: AdminDashbordComponent },
  { path: 'admin/profil', canActivate: [AuthGuardService], component: AdminProfilComponent },
  { path: 'login', component: SigninComponent },
  { path: 'album/:id', component: AlbumComponent },
  { path: 'profil', component: ProfilComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '*', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
