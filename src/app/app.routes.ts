import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';
import { pendingApprovalGuard } from './guards/pending-approval.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then((m) => m.RegistroComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'pending-approval',
    loadComponent: () =>
      import('./pages/pending-approval/pending-approval.component').then((m) => m.PendingApprovalComponent),
    canActivate: [pendingApprovalGuard],
  },
  // Portal admin: ruta de primer nivel para que authGuard no se ejecute al entrar
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/admin/pedidos/admin-pedidos.component').then((m) => m.AdminPedidosComponent),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/admin/inventario/admin-inventario.component').then((m) => m.AdminInventarioComponent),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/admin/historial/admin-historial.component').then((m) => m.AdminHistorialComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/admin/perfil/admin-perfil.component').then((m) => m.AdminPerfilComponent),
      },
      {
        path: 'aprobar-clientes',
        loadComponent: () =>
          import('./pages/admin/admin.component').then((m) => m.AdminComponent),
      },
    ],
  },
  // App para clientes (Tienda, Carrito, Mis Pedidos); authGuard redirige admin a /admin
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/tienda/tienda.component').then((m) => m.TiendaComponent),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./pages/carrito/carrito.component').then((m) => m.CarritoComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
