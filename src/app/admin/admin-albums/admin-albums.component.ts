import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Album } from 'src/app/interfaces/album';
import { AlbumService } from 'src/app/services/album.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-albums',
  templateUrl: './admin-albums.component.html',
  styleUrls: ['./admin-albums.component.css']
})
export class AdminAlbumsComponent implements OnInit {
  albumsForm: FormGroup;
  albumsSubscription: Subscription;
  albums: Album[] = [];

  indexToRemove;
  indexToUpdate;
  editMode = false;

  photoUploading = false;
  photoUploaded = false;
//  photoUrl: string;
  photosAdded: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private albumsService: AlbumService
  ) {}

  ngOnInit() {
    this.initAlbumsFrom();
    this.albumsService.albumsSubject.subscribe(
      (data: Album[]) => {
        this.albums = data;
      }
    );
    this.albumsService.getAlbums();
    this.albumsService.emitAlbums();
  }

  initAlbumsFrom() {
    this.albumsForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: '',
      afficher: ''
    });
  }
  onSubmitAlbumsForm() {
    const newalbum: Album = this.albumsForm.value;
    newalbum.afficher = this.albumsForm.get('afficher').value ? this.albumsForm.get('afficher').value : false;
    // newalbum.photo = this.photoUrl ? this.photoUrl : '';
    newalbum.photos = this.photosAdded ? this.photosAdded : [];
    if (this.editMode) {
      this.albumsService.updateAlbum(newalbum, this.indexToUpdate);
    } else {
      this.albumsService.createAlbum(newalbum);
    }
    $('#albumsFromModal').modal('hide');
  }

  resetForm() {
    this.editMode = false;
    this.albumsForm.reset();
    // this.photoUrl = '';
    this.photosAdded = [];
  }

  onDeleteAlbum(index) {
    $('#deleteAlbumModal').modal('show');
    this.indexToRemove = index;
  }

  onConfirmDeleteAlbum() {
    // if (this.albums[this.indexToRemove].photo && this.albums[this.indexToRemove].photo !== '') {
    //   this.albumsService.removeFile(this.albums[this.indexToRemove].photo);
    // }
    this.albums[this.indexToRemove].photos.forEach(
      (photo) => {
        this.albumsService.removeFile(photo);
      }
    );
    this.albumsService.deleteAlbum(this.indexToRemove);
    $('#deleteAlbumModal').modal('hide');
  }

  onEditAlbum(album: Album) {
    this.editMode = true;
    $('#albumsFromModal').modal('show');
    this.albumsForm.get('title').setValue(album.title);
    this.albumsForm.get('description').setValue(album.description ? album.description : '');
    this.albumsForm.get('afficher').setValue(album.afficher);
    // this.photoUrl = album.photo ? album.photo : '';
    this.photosAdded = album.photos ? album.photos : [];
    const index = this.albums.findIndex(
      (albumEl) => {
        if (albumEl === album) {
          return true;
        }
      }
    );
    this.indexToUpdate = index;
  }

  onUploadFile(event) {
    for (const file of event.target.files) {
      this.albumsService.uploadFile(file).then(
        (url: string) => {
          // if (this.photoUrl && this.photoUrl !== '') {
          //   this.albumsService.removeFile(this.photoUrl);
          // }
          // this.photoUrl = url;
          this.photosAdded.push(url);
          this.photoUploading = false;
          this.photoUploaded = true;
          setTimeout(() => {
            this.photoUploaded = false;
          }, 5000);
        }
      );
    }
  }

  onRemoveAddedPhoto(index) {
    this.albumsService.removeFile(this.photosAdded[index]);
    this.photosAdded.splice(index, 1);
  }

  onSortable(albums) {
    console.log(albums);

    for (const album of albums) {
    const index = albums.indexOf(album);
    // const index = albums.findIndex(
    //   (albumEl) => {
    //     if (albumEl === album) {
    //       return true;
    //     }
    //   }
    // );
    console.log('index : ' + index + ' / titre : ' + album.title);
    this.indexToUpdate = index;
    this.albumsService.updateAlbum(album, this.indexToUpdate);
    this.albumsService.emitAlbums();
    }
    console.log(this.albums);
  }
}
