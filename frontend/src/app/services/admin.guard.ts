import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { User } from './user';

export const adminGuard: CanActivateFn = () => {
  const user = inject(User);
  const router = inject(Router);

  if (!user.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }

  // Decode JWT token to check role
  const token = user.token;
  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'admin') {
      return true;
    }
  } catch (e) {
    console.error('Error decoding token:', e);
  }

  router.navigateByUrl('/');
  return false;
};

