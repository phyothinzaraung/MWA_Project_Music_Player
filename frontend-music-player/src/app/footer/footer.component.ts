import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { Subscription, takeWhile } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { ISong } from '../interfaces/ISong.interface';
import { AudioPlayerService } from '../services/audio-player.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  song!: ISong;
  songList: ISong[] = [];
  song_title: string = '';
  private subscription: Subscription;
  private audio: HTMLAudioElement;
  audioPlayerService = inject(AudioPlayerService);
  currentTime!: string;
  duration!: string;
  seekBarValue!: number;
  isPlaying!: boolean;
  isPaused!: boolean;
  isSongLoaded!: boolean;
  currentSongIndex: number = 0;
  isShuffle: boolean = false;
  isRepeatOnce: boolean = false;
  isMainPage: boolean = false;
  auth = inject(AuthService);

  constructor(private sharedService: SharedService) {
    this.audio = new Audio();

    this.subscription = this.sharedService.data$.subscribe(({ song, songList }) => {
      console.log('Received Song:', song);
      console.log('Received Song List:', songList);

      this.song = song;
      this.songList = songList;
      this.updateCurrentIndex(this.song);
      this.playSong(this.song);
    });
  }

  updateCurrentIndex(song: ISong) {
    this.currentSongIndex = this.songList.findIndex(s => s._id == song._id);
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  playSong(song: ISong): void {
    console.log("Inside Play Song", this.songList);
    this.song_title = song.song_title;

    console.log(this.currentSongIndex);

    if (this.isPaused) {
      this.audioPlayerService.audio.play();
      this.isPlaying = true;
      this.isPaused = false;
    } else {
      this.audioPlayerService.playSong(song.song_url);
      this.isPlaying = true;
      this.isPaused = false;
    }

    this.isPlaying = true;

    this.audioPlayerService.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audioPlayerService.getCurrentTime();
      this.duration = this.audioPlayerService.getDuration();
      this.seekBarValue = this.audioPlayerService.calculateSeekBarValue();
    });

    this.audioPlayerService.audio.removeEventListener('ended', this.handleSongEnd);

    this.audioPlayerService.audio.addEventListener('ended', this.handleSongEnd);
  }

  handleSongEnd = () => {
    if (this.isRepeatOnce) {
      this.currentSongIndex = this.currentSongIndex;
    } else if (this.isShuffle) {
      this.currentSongIndex = Math.floor(Math.random() * this.songList.length);
    } else {
      this.currentSongIndex++;
      if (this.currentSongIndex >= this.songList.length) {
        this.currentSongIndex = 0;
      }
    }
    this.playSong(this.songList[this.currentSongIndex]);
  };

  next() {
    if (this.isShuffle) {
      this.currentSongIndex = Math.floor(Math.random() * this.songList.length);
      this.playSong(this.songList[this.currentSongIndex])
    }
    else {
      this.currentSongIndex = this.currentSongIndex + 1;
      if (this.currentSongIndex >= this.songList.length) {
        this.currentSongIndex = 0;
      }
      this.playSong(this.songList[this.currentSongIndex])
    }
  }

  prev() {
    if (this.isShuffle) {
      this.currentSongIndex = Math.floor(Math.random() * this.songList.length);
      this.playSong(this.songList[this.currentSongIndex])
    }
    else {
      this.currentSongIndex = this.currentSongIndex - 1;
      if (this.currentSongIndex < 0) {
        this.currentSongIndex = 0;
      }
      this.playSong(this.songList[this.currentSongIndex])
    }
  }

  toggleRepeat() {
    this.isRepeatOnce = !this.isRepeatOnce;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
  }

  resetAudioPlayer(): void {
    this.audioPlayerService.pauseSong();
    this.currentTime = '00:00';
    this.duration = '00:00';
    this.seekBarValue = 0;
    this.currentSongIndex = 0;
  }

  pauseSong(): void {
    this.audioPlayerService.pauseSong();
    this.isPlaying = false;
    this.isPaused = true;
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this.pauseSong();
    } else {
        this.playSong(this.song);
    }
  }

  onSeekBarChange(event: any): void {
    const seekValue = event.target.value;
    this.audioPlayerService.setAudioTime(seekValue);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
