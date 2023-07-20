import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IResponse } from '../interfaces/IResponse.interface';
import { ISong } from '../interfaces/ISong.interface';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  #http = inject(HttpClient)

  getSongs(){
    return this.#http.get<IResponse<ISong[]>>('http://localhost:3000/songs');
  }

  getGenres(){
    return this.#http.get<IResponse<string[]>>('http://localhost:3000/songs/genres');
  }

  getArtists(){
    return this.#http.get<IResponse<string[]>>('http://localhost:3000/songs/artists');
  }

  getSongsByGenre(genre: string){
    return this.#http.get<IResponse<ISong[]>>('http://localhost:3000/songs/genres/' + genre);
  }

  getSongsByArtist(artist: string){
    return this.#http.get<IResponse<ISong[]>>('http://localhost:3000/songs/artists/' + artist);
  }

  search(song_title: string){
    return this.#http.get<IResponse<ISong[]>>("http://localhost:3000/songs?search=" + song_title);
  }
}
