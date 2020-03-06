import { Component, OnInit } from '@angular/core';
import { Album } from '../interfaces/album';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album: Album;

  constructor(
    private route: ActivatedRoute,
    private albumsService: AlbumService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // const id = this.route.snapshot.params['id','..'];
    this.albumsService.getSingleAlbums(id).then(
      (album: Album) => {
        this.album = album;
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }
}
