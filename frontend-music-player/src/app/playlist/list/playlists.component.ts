import { Component, inject } from '@angular/core';
import { SongService } from '../../services/song.service';
import { Router } from '@angular/router';
import { PlaylistService } from '../playlist.service';
import { IPlaylist } from '../../interfaces/IPlaylist.interface';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistComponent {
  #router = inject(Router);
  #song_service = inject(SongService);
  #playlist_service = inject(PlaylistService);
  artistList: string[] = [];
  genreList: string[] = [];
  playlists: IPlaylist[] = [];

  showCreatePlaylistDialog:boolean = false;
  newPlaylistName: string = '';

  constructor(){
    this.#song_service.getGenres().subscribe(response => {
      if(response.success){
        this.genreList = response.data;
      }
    });

    this.#song_service.getArtists().subscribe(response => {
      if(response.success){
        this.artistList = response.data;
      }
    });
  }

  ngOnInit(){
    this.reloadMyPlaylist();
  }

  reloadMyPlaylist(){
    this.#playlist_service.getAllPlaylists().subscribe(response => {
      if(response.success){
        this.playlists = response.data;
      }
    });
  }

  getDetailsPlaylist(playlist: IPlaylist){
    this.#router.navigate(['', 'playlist', 'details', playlist._id ]);
  }

  getSongsByGenre(genre: string){
    const data = {genre};
    this.#router.navigate(["/search"], { queryParams: data });
  }

  getSongsByArtist(artist: string){
    const data = {artist};
    this.#router.navigate(["/search"], {queryParams: data});
  }

  openCreatePlaylistModal() {
    this.showCreatePlaylistDialog = true;
  }

  cancelCreatePlaylist() {
    this.showCreatePlaylistDialog = false;
    this.newPlaylistName = '';
  }

  confirmCreatePlaylist() {
    console.log('New playlist name:', this.newPlaylistName);
    const data = {name: this.newPlaylistName};

    this.#playlist_service.createNewPlaylist(data as IPlaylist).subscribe(response => {
      if(response.success){
        this.#router.navigate(['/playlist']);
        this.reloadMyPlaylist();
      }else{
        console.log("add playlist fail");
      }
    })

    this.showCreatePlaylistDialog = false;
    this.newPlaylistName = '';
  }

  delete_playlist(event: Event, playlist_id: string){
    event?.stopPropagation();
      this.#playlist_service.deletePlaylist(playlist_id).subscribe(response => {
        if(response.success){
          this.reloadMyPlaylist();
        }
      });
  }
}
