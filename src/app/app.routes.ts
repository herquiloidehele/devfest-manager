import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/events/event-list').then((module) => module.EventList),
  },
  {
    path: 'event/:id',
    loadComponent: () =>
      import('./features/events/event-details').then((module) => module.EventDetails),
  },
  {
    path: 'admin/create',
    loadComponent: () =>
      import('./features/admin/create-event').then((module) => module.CreateEvent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
