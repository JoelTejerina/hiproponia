import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirige si ya está logueado: admin -> /admin, cliente aprobado -> /, pendiente -> /pending-approval. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;
  if (auth.isAdmin()) return router.createUrlTree(['/admin']);
  if (auth.isApproved()) return router.createUrlTree(['/']);
  return router.createUrlTree(['/pending-approval']);
};
