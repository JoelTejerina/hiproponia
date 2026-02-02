import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

// ========== FASE DE PRUEBAS (sin backend) ==========
// Con backend: usuarios, aprobaciones, registro y eliminación vendrán del API (GET/POST/PUT/DELETE).

const STORAGE_KEY_USERS = 'hidroponia_users';

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    razonSocial: '',
    role: 'admin',
    approved: true,
  },
  {
    id: '2',
    username: 'mayorista1',
    password: 'cliente123',
    razonSocial: 'Verduras Frescas S.A. de C.V.',
    email: 'contacto@verdurasfrescas.com',
    role: 'client',
    approved: false,
  }
];

function nextIdFromList(list: User[]): string {
  const max = list.reduce((maxId, u) => {
    const n = parseInt(u.id, 10);
    return isNaN(n) ? maxId : Math.max(maxId, n);
  }, 0);
  return String(max + 1);
}

@Injectable({ providedIn: 'root' })
export class UserService {
  /** FASE DE PRUEBAS: carga usuarios desde localStorage. BACKEND: inicializar con [] y cargar con GET /users (o similar). */
  private usersSignal = signal<User[]>(this.loadFromStorage());

  readonly users = this.usersSignal.asReadonly();

  readonly clients = computed(() =>
    this.usersSignal().filter((u) => u.role === 'client')
  );

  /** FASE DE PRUEBAS: carga usuarios desde localStorage. BACKEND: eliminar; datos desde API. */
  private loadFromStorage(): User[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS);
      if (raw) {
        const parsed = JSON.parse(raw) as User[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignorar datos corruptos o antiguos
    }
    return [...MOCK_USERS];
  }

  /** FASE DE PRUEBAS: guarda usuarios en localStorage. BACKEND: eliminar; cambios vía API (PUT/PATCH). */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.usersSignal()));
    } catch {
      // sin persistencia si falla (ej. modo privado)
    }
  }

  /** BACKEND: puede ser GET /users/:id o resolver desde caché/estado tras login. */
  getUserById(id: string): User | undefined {
    return this.usersSignal().find((u) => u.id === id);
  }

  /** BACKEND: puede ser GET /users?username=... o validación en login. */
  getUserByUsername(username: string): User | undefined {
    return this.usersSignal().find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );
  }

  /** FASE DE PRUEBAS: actualiza aprobación en memoria y localStorage. BACKEND: reemplazar por PATCH/PUT /users/:id (approved). */
  setApproved(userId: string, approved: boolean): void {
    this.usersSignal.update((list) =>
      list.map((u) => (u.id === userId ? { ...u, approved } : u))
    );
    this.saveToStorage();
  }

  /**
   * FASE DE PRUEBAS: elimina usuario en memoria y localStorage (solo clientes).
   * BACKEND: reemplazar por DELETE /users/:id.
   */
  deleteUser(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user || user.role === 'admin') return false;
    this.usersSignal.update((list) => list.filter((u) => u.id !== userId));
    this.saveToStorage();
    return true;
  }

  /**
   * FASE DE PRUEBAS: crea usuario en memoria y localStorage.
   * BACKEND: reemplazar por POST /auth/register (o POST /users); el servidor devuelve el usuario creado y errores de validación.
   */
  register(data: {
    username: string;
    password: string;
    razonSocial: string;
    email?: string;
  }): { success: boolean; error?: string } {
    const username = data.username.trim();
    const razonSocial = data.razonSocial.trim();

    if (!username || !data.password || !razonSocial) {
      return { success: false, error: 'Usuario, contraseña y razón social son obligatorios.' };
    }

    if (this.getUserByUsername(username)) {
      return { success: false, error: 'Ese usuario ya está registrado.' };
    }

    const list = this.usersSignal();
    const newUser: User = {
      id: nextIdFromList(list),
      username,
      password: data.password,
      razonSocial,
      email: data.email?.trim() || undefined,
      role: 'client',
      approved: false,
    };

    this.usersSignal.update((l) => [...l, newUser]);
    this.saveToStorage();
    return { success: true };
  }
}
