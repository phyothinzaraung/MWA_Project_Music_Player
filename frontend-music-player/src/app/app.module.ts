import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors} from '@angular/common/http'
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { PlaylistComponent } from './playlist/list/playlists.component';
import { addTokenInterceptor } from './add-token.interceptor';

const bootstrap = ()=>{
  const auth = inject(AuthService);
  return ()=>{
    const state = localStorage.getItem("MUSIC_PLAYER_STATE");
    if(state){
      auth.state_signal.set(JSON.parse(state))
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: MainComponent },
      { path: 'search', component: SearchComponent },
      { path: 'playlist', loadChildren: ()=> import('./playlist/playlists.module').then(m=> m.PlaylistsModule),
        canActivate: [()=>inject(AuthService).state_signal().jwt ? true: false]},
      { path: 'signin', component: SigninComponent},
      { path: 'signup', component: SignupComponent },
      { path: '**', redirectTo: 'home'}
    ], {bindToComponentInputs: true})
  ],
  providers: [
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    {provide: APP_INITIALIZER, multi: true, useFactory: bootstrap}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
