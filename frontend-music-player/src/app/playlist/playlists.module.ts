import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from './list/playlists.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlaylistDetailComponent } from './details/playlist-detail.component';


@NgModule({
  declarations: [
    PlaylistComponent,
    PlaylistDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', redirectTo: '', pathMatch: "full"},
      {path: '', component: PlaylistComponent},
      {path: 'details/:playlist_id', component: PlaylistDetailComponent}
    ]),
    FormsModule
  ]
})
export class PlaylistsModule { }
