import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protege rutas de la app para clientes. Si es admin, redirige al portal de administración. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (!auth.isApproved()) {
    return router.createUrlTree(['/pending-approval']);
  }
  // El admin no ve Tienda/Carrito/Mis Pedidos; solo el portal admin
  if (auth.isAdmin()) {
    return router.createUrlTree(['/admin']);
  }
  return true;
};
