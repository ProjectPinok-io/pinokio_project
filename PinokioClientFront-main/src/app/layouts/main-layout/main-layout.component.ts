import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    MenuModule,
    NavbarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isCollapsed = false;
  isHidden = false;

  menuItems = [
    { label: 'Home', icon: 'pi pi-home' },
    { label: 'Profile', icon: 'pi pi-user' },
  ];

  onResize(event: any) {
    this.updateSidebarState(event.target.innerWidth);
  }

  updateSidebarState(width: number) {
    if (width < 768) {
      this.isHidden = true;
      this.isCollapsed = false;
    } else if (width < 1024) {
      this.isHidden = false;
      this.isCollapsed = true;
    } else {
      this.isHidden = false;
      this.isCollapsed = false;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
