import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfilService } from '../services/profil.service';
import { Subscription } from 'rxjs';
import { Profil } from '../interfaces/profil';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {

  profil: Profil;
  profilSubscription: Subscription;

  constructor(
    private profilService: ProfilService
  ) { }

  ngOnInit() {
    this.profilSubscription = this.profilService.profilSubject.subscribe(
      (data: any) => {
        this.profil = data;
      }
    );
    this.profilService.getProfil();
    this.profilService.emitProfil();
  }

  ngOnDestroy() {
    this.profilSubscription.unsubscribe();
  }

}
