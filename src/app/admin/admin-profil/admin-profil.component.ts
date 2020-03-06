import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Profil } from 'src/app/interfaces/profil';
import { ProfilService } from 'src/app/services/profil.service';

@Component({
  selector: 'app-admin-profil',
  templateUrl: './admin-profil.component.html',
  styleUrls: ['./admin-profil.component.css']
})
export class AdminProfilComponent implements OnInit {

  profilForm: FormGroup;
  profilSubscription: Subscription;
  profil: Profil;

  editMode = false;

  submitCompleted = false;

  photoUploading = false;
  photoUploaded = false;
  photoUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private profilService: ProfilService
  ) { }

  ngOnInit() {
    this.initProfilForm();
    this.profilService.profilSubject.subscribe(
      (data: Profil) => {
        this.profil = data;
        if (this.profil) {
          this.onEditProfil(this.profil);
        }
      }
    );
    this.profilService.getProfil();
    this.profilService.emitProfil();

  }

  initProfilForm() {
    this.profilForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      equipement: '',
      parcours: '',
    });
  }
  onSubmitProfilForm() {
    const newProfil: Profil = this.profilForm.value;
    newProfil.photo = this.photoUrl ? this.photoUrl : '';
    if (this.editMode) {
      this.profilService.updateProfil(newProfil);
      this.submitCompleted = true;
      console.log('edit');
    } else {
      this.profilService.createProfil(newProfil);
      this.submitCompleted = true;
      console.log('creat');
    }
  }

  onEditProfil(profil: Profil) {
    this.editMode = true;
    this.profilForm.get('nom').setValue(profil.nom);
    this.profilForm.get('prenom').setValue(profil.prenom);
    this.profilForm.get('equipement').setValue(profil.equipement ? profil.equipement : '');
    this.profilForm.get('parcours').setValue(profil.parcours ? profil.parcours : '');
    this.photoUrl = profil.photo ? profil.photo : '';
  }

  onRemoveAddedPhoto() {
    this.profilService.removeFile(this.profil.photo);
  }

  onUploadFile(event) {
    this.onRemoveAddedPhoto();
    this.photoUploading = true;
    this.profilService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        if (this.photoUrl && this.photoUrl !== '') {
          this.profilService.removeFile(this.photoUrl);
        }
        this.photoUrl = url;
        this.photoUploading = false;
        this.photoUploaded = true;
        setTimeout(() => {
          this.photoUploaded = false;
        }, 5000);
      }
    );
  }

}
