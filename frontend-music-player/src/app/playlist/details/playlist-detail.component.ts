import { Component, Input, inject } from '@angular/core';
import { ISong } from 'src/app/interfaces/ISong.interface';
import { SongService } from 'src/app/services/song.service';
import { PlaylistService } from '../playlist.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent {

  #song_service = inject(SongService);
  #playlist_service = inject(PlaylistService);
  playlist_name: string = '';
  allSongList: ISong[] = [];
  songList: ISong[] = [];
  searchText: string = '';
  #shared_service = inject(SharedService);

  @Input() playlist_id = '';

  constructor(){

    this.#song_service.getSongs().subscribe(response =>{
      if(response.success){
        this.allSongList = response.data
      }
    });
  }

  ngOnInit(){
    this.reloadMyPlayList();
  }

  reloadMyPlayList() {
    this.#playlist_service.getPlaylistByID(this.playlist_id).subscribe(response => {
      if(response.success){
        this.playlist_name = response.data.name;
        this.songList = response.data.songs;
      }
    });
  }

  onSearchTextChange(){
    this.#song_service.search(this.searchText).subscribe(response => {
      if(response.success){
        this.allSongList = response.data
      }
    })
  }

  addToPlaylist(song: ISong) {
    console.log(this.songList.length);
  
    let songExists = false;
  
    if (this.songList.length !== 0) {
      this.songList.forEach(eachSong => {
        if (eachSong._id === song._id) {
          console.log("Song already exists in playlist");
          songExists = true;
        }
      });
    }
  
    if (!songExists) {
      this.#playlist_service.addToPlaylist(this.playlist_id, song).subscribe(response => {
        if (response.success) {
          this.reloadMyPlayList();
        }
      });
    }
  }
  

  removeFromPlaylist(song_id: string){
    this.#playlist_service.removeFromPlaylist(this.playlist_id, song_id).subscribe(response => {
      if(response.success){
        this.reloadMyPlayList();
      }
    })
  }

  playSong(song: ISong, songList: ISong[]){
    this.#shared_service.sendData(song, songList);
  }

}
