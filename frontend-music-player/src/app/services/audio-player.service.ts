import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  playSong(songUrl: string): void {
    this.audio.src = songUrl;
    this.audio.play();
  }

  pauseSong(): void {
    this.audio.pause();
  }

  stopSong(){
    this.pauseSong();
    this.audio.currentTime = 0;
  }

  getCurrentTime(): string {
    return this.formatTime(this.audio.currentTime);
  }

  getDuration(): string {
    return this.formatTime(this.audio.duration);
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesString}:${secondsString}`;
  }

  calculateSeekBarValue(): number {
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    if (duration && !isNaN(currentTime)) {
      return (currentTime / duration) * 100;
    }
    return 0;
  }

  setAudioTime(seekTime: number): void {
    if (this.audio.readyState === 4) {
      const duration = this.audio.duration;
      if (!isNaN(duration)) {
        const timeToSeek = (seekTime / 100) * duration;
        this.audio.currentTime = timeToSeek;
      }
    }
  }
}
