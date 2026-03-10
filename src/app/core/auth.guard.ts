import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return router.createUrlTree(['/']);
  }

  const isAdmin = localStorage.getItem('isAdmin');

  if (isAdmin === 'true') {
    return true;
  }

  alert('You do not have permission to access this page.');
  return router.createUrlTree(['/']);
};
