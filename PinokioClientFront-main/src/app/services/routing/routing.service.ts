import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(
    private router: Router,
    private location: Location,
  ) {}

  goBack(): void {
    this.location.back();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToLandingPage(): void {
    this.router.navigate(['/']);
  }

  navigateTo(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
