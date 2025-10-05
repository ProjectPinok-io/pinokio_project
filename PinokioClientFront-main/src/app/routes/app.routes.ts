import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';

export const app_routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: '', component: LandingPageComponent }],
  },
];
