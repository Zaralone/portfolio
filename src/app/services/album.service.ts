import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Album } from '../interfaces/album';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  albums: Album[] = [];

  albumsSubject = new Subject<Album[]>();

  constructor() { }

  emitAlbums() {
    this.albumsSubject.next(this.albums);
  }

  saveAlbums() {
    firebase.database().ref('/albums').set(this.albums);
  }

  getAlbums() {
    firebase.database().ref('/albums').on('value', (data) => {
      this.albums = data.val() ? data.val() : [];
      this.emitAlbums();
    });
  }

  getSingleAlbums(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/albums/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createAlbum(album: Album) {
    this.albums.push(album);
    this.saveAlbums();
    this.emitAlbums();
  }

  deleteAlbum(index) {
    this.albums.splice(index, 1);
    this.saveAlbums();
    this.emitAlbums();
  }

  updateAlbum(album: Album , index) {
    // this.albums[index] = album;
    // this.savealbums();
    // this.emitalbums();
    firebase.database().ref('/albums/' + index).update(album).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  updateAlbums(albums: Album[]) {
    // this.albums[index] = album;
    // this.savealbums();
    // this.emitalbums();
    console.log(albums);
    for (let index = 0; index < albums.length; index++) {
      firebase.database().ref('/albums/' + index).update(albums[index]).catch(
        (error) => {
          console.log(error);
        }
      );
    }
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const fileName = uniqueId + file.name;
        const upload = firebase.storage().ref().child('images/albums/' + fileName).put(file);
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
