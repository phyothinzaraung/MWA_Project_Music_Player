import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISong } from '../interfaces/ISong.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private dataSubject = new Subject<{ song: ISong, songList: ISong[] }>();
  public data$ = this.dataSubject.asObservable();

  sendData(song: ISong, songList: ISong[]): void {
    this.dataSubject.next({ song, songList });
  }
}
