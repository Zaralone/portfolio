import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'Mon album';

  albums = [];
  albumsSubscription: Subscription;


  constructor(
    private albumsService: AlbumService,
  ) { }

  ngOnInit() {
    this.albumsSubscription = this.albumsService.albumsSubject.subscribe(
      (data: any) => {
        this.albums = data;
      }
    );
    this.albumsService.getAlbums();
    this.albumsService.emitAlbums();
  }

  ngOnDestroy() {
    this.albumsSubscription.unsubscribe();
  }

}
