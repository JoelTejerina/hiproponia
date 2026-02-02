import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Solo permite acceso si está logueado y NO está aprobado (pendiente de aprobación). */
export const pendingApprovalGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (auth.isApproved()) {
    return router.createUrlTree(['/']);
  }
  return true;
};
