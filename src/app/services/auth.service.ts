import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';

// ========== FASE DE PRUEBAS (sin backend) ==========
// Con backend: eliminar persistencia en localStorage; usar token/sesión del API (ej. JWT).

const STORAGE_KEY_SESSION = 'hidroponia_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userService = inject(UserService);
  private currentUserIdSignal = signal<string | null>(this.loadSessionFromStorage());

  /**
   * FASE DE PRUEBAS: restaura sesión desde localStorage.
   * BACKEND: eliminar; la sesión vendrá del token (ej. interceptors, validar JWT al cargar la app).
   */
  private loadSessionFromStorage(): string | null {
    try {
      const id = localStorage.getItem(STORAGE_KEY_SESSION);
      if (id) {
        const user = this.userService.getUserById(id);
        if (user) return id;
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch {
      // ignorar
    }
    return null;
  }

  /**
   * FASE DE PRUEBAS: guarda sesión en localStorage.
   * BACKEND: eliminar; el servidor gestionará la sesión (token en cookie o almacenamiento seguro).
   */
  private saveSessionToStorage(userId: string | null): void {
    try {
      if (userId) localStorage.setItem(STORAGE_KEY_SESSION, userId);
      else localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {
      // ignorar
    }
  }

  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /** BACKEND: puede venir del token o de GET /me (usuario actual). */
  readonly currentUser = computed(() => {
    const id = this.currentUserIdSignal();
    return id ? this.userService.getUserById(id) ?? null : null;
  });

  readonly isLoggedIn = computed(() => this.currentUserIdSignal() != null);

  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  readonly isApproved = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return user.role === 'admin' || user.approved;
  });

  /**
   * FASE DE PRUEBAS: valida contra UserService (localStorage).
   * BACKEND: reemplazar por POST /auth/login (o similar); guardar token y obtener usuario desde respuesta.
   */
  login(username: string, password: string): boolean {
    const user = this.userService.getUserByUsername(username);
    if (!user || user.password !== password) return false;
    this.currentUserIdSignal.set(user.id);
    this.saveSessionToStorage(user.id);
    return true;
  }

  /**
   * FASE DE PRUEBAS: limpia sesión local.
   * BACKEND: opcionalmente llamar POST /auth/logout para invalidar sesión en servidor; luego limpiar token local.
   */
  logout(): void {
    this.currentUserIdSignal.set(null);
    this.saveSessionToStorage(null);
  }
}
