import { Injectable } from '@angular/core';
import { Profil } from '../interfaces/profil';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  profil: Profil;
  profilSubject = new Subject<Profil>();

  constructor() { }

  emitProfil() {
    this.profilSubject.next(this.profil);
  }

  saveProfil() {
    firebase.database().ref('/profil').set(this.profil);
  }

  getProfil() {
    firebase.database().ref('/profil').on('value', (data) => {
      this.profil = data.val() ? data.val() : [];
      this.emitProfil();
    });
  }

  createProfil(profil: Profil) {
    this.profil = profil;
    this.saveProfil();
    this.emitProfil();
  }

  updateProfil(profil: Profil) {
    firebase.database().ref('/profil').update(profil).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const fileName = uniqueId + file.name;
        const upload = firebase.storage().ref().child('images/profil/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement ...');
          },
          (error) => {
            console.log(error);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downLoadUrl) => {
                resolve(downLoadUrl);
              }
            );
          }
        );
      }
    );
  }

  removeFile(fileLink: string) {
    if (fileLink) {
      const storageRef = firebase.storage().refFromURL(fileLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
