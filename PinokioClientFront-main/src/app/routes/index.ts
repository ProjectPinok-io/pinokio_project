import { Routes } from '@angular/router';
import { app_routes } from './app.routes';

export const routes: Routes = [...app_routes, { path: '**', redirectTo: '/' }];
