import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html' ,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  auth = inject(AuthService);
  
  selectedItem: string = 'home';

  selectItem(item: string) {
    this.selectedItem = item;
  }
}
