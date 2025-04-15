import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main/main.component').then(c => c.MainComponent),
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 