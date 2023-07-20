import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="sidebar">
        <app-sidebar></app-sidebar>
      </div>
      <div class="main-content">
        <router-outlet ></router-outlet>
      </div>
    </div>

<app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {
  
}
