import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { User } from './user';

export const authGuard: CanActivateFn = () => {
  const user = inject(User);
  const router = inject(Router);

  if (user.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};


