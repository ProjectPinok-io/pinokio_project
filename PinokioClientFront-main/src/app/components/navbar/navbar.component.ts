import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RoutingService } from '../../services/routing/routing.service';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  routingService = inject(RoutingService);

  back(): void {
    this.routingService.navigateToLandingPage();
  }
}
