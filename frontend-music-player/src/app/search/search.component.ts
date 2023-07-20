import { Component, inject } from '@angular/core';
import { SongService } from '../services/song.service';
import { ISong } from '../interfaces/ISong.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  #song_service = inject(SongService);
  #shared_service = inject(SharedService);
  #auth = inject(AuthService);
  #router = inject(Router);
  songList: ISong[] = [];
  data: any;
  searchText: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.data = params;
    });

    if (this.data.genre) {
      this.#song_service.getSongsByGenre(this.data.genre).subscribe(response => {
        if (response.success) {
          this.songList = response.data
        }
      })
    } else if (this.data.artist) {
      this.#song_service.getSongsByArtist(this.data.artist).subscribe(response => {
        if (response.success) {
          this.songList = response.data
        }
      })
    }
    else {
      this.#song_service.getSongs().subscribe(response => {
        if (response.success) {
          this.songList = response.data
        }
      });
    }
  }

  onSearchTextChange() {
    this.#song_service.search(this.searchText).subscribe(response => {
      if (response.success) {
        this.songList = response.data
      }
    })
  }

  playSong(song: ISong, songList: ISong[]) {
    if (!this.#auth.state_signal()._id) {
      this.#router.navigate(["/signin"]);
    } else {
      this.#shared_service.sendData(song, songList);
    }
  }
}
