import { Component, inject } from '@angular/core';
import { SongService } from '../services/song.service';
import { ISong } from '../interfaces/ISong.interface';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  #router = inject(Router);
  #song_service = inject(SongService);
  #shared_service = inject(SharedService);
  #auth = inject(AuthService);
  songList: ISong[] = [];
  artistList: string[] = [];
  genreList: string[] = [];

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

    this.#song_service.getSongs().subscribe(response => {
      if(response.data){
        this.songList = response.data;
      }
    })
  }

  getSongsByGenre(genre: string){
    const data = {genre};
    this.#router.navigate(["/search"], { queryParams: data });
  }

  getSongsByArtist(artist: string){
    const data = {artist};
    this.#router.navigate(["/search"], {queryParams: data});
  }

  playSong(song: ISong, songList: ISong[]){
    if(!this.#auth.state_signal()._id){
      this.#router.navigate(['/signin']);
    }else{
      this.#shared_service.sendData(song, songList);
    }
  }
}
