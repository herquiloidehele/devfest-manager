import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  console.log({ route, state });

  const router = inject(Router);

  const isAdmin = localStorage.getItem('isAdmin');

  if (isAdmin === 'true') {
    return true;
  }

  alert('You do not have permission to access this page.');
  return router.createUrlTree(['/']);
};
