import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPlaylist } from '../interfaces/IPlaylist.interface';
import { IResponse } from '../interfaces/IResponse.interface';
import { ISong } from '../interfaces/ISong.interface';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  #http = inject(HttpClient);

  getAllPlaylists(){
    return this.#http.get<IResponse<IPlaylist[]>>("http://localhost:3000/playlists");
  }

  getPlaylistByID(playlist_id: string){
    return this.#http.get<IResponse<IPlaylist>>("http://localhost:3000/playlists/" + playlist_id);
  }

  createNewPlaylist(data: IPlaylist){
    return this.#http.post<IResponse<string>>("http://localhost:3000/playlists", data);
  }

  addToPlaylist(playlist_id: string, song: ISong){
    return this.#http.post<IResponse<string>>("http://localhost:3000/playlists/" + playlist_id, song);
  }

  removeFromPlaylist(playlist_id: string, song_id: string){
    return this.#http.delete<IResponse<string>>("http://localhost:3000/playlists/" + playlist_id + "/songs/" + song_id);
  }

  deletePlaylist(playlist_id: string){
    return this.#http.delete<IResponse<string>>("http://localhost:3000/playlists/" + playlist_id);
  }
}
