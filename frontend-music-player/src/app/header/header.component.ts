import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, INITIAL_STATE } from '../services/auth.service';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  auth = inject(AuthService);
  #router = inject(Router);
  #song_service = inject(AudioPlayerService);

  constructor(){
    console.log("Login username",this.auth.state_signal().fullname);
  }

  signIn(){
    this.#router.navigate(["/signin"]);
  }

  signUp(){
    this.#router.navigate(["/signup"]);
  }

  signOut(){
    this.auth.state_signal.set(INITIAL_STATE);
    localStorage.clear();
    this.#song_service.stopSong();
    this.#router.navigate(['/home']);
  }
}
