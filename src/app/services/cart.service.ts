import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

// ========== FASE DE PRUEBAS (sin backend) ==========
// El carrito es solo en memoria. Con backend opcional: GET/POST/PUT /cart para sincronizar carrito por usuario.

const TAX_RATE = 0.08;
const FREE_SHIPPING_MIN = 500;

@Injectable({ providedIn: 'root' })
export class CartService {
  /** FASE DE PRUEBAS: carrito en memoria. BACKEND (opcional): cargar con GET /cart al iniciar sesión; guardar con POST/PUT al añadir/quitar. */
  private itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly shipping = computed(() => {
    const sub = this.subtotal();
    return sub >= FREE_SHIPPING_MIN ? 0 : 80;
  });

  readonly tax = computed(() => Math.round(this.subtotal() * TAX_RATE * 100) / 100);

  readonly total = computed(() => {
    const sub = this.subtotal();
    const ship = this.shipping();
    const taxVal = this.tax();
    return Math.round((sub + ship + taxVal) * 100) / 100;
  });

  readonly hasFreeShipping = computed(() => this.subtotal() >= FREE_SHIPPING_MIN);

  addItem(product: Product, quantity = 1): void {
    this.itemsSignal.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...current, { product, quantity }];
    });
  }

  removeItem(productId: string): void {
    this.itemsSignal.update((current) =>
      current.filter((i) => i.product.id !== productId)
    );
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    this.itemsSignal.update((current) =>
      current.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
