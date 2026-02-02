import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart.model';

// ========== FASE DE PRUEBAS (sin backend) ==========
// Con backend: pedidos, creación, actualización de estado y comprobante vendrán del API (GET/POST/PATCH, subida de archivos).

const STORAGE_KEY_ORDERS = 'hidroponia_orders';

function nextOrderId(orders: Order[]): string {
  const nums = orders
    .map((o) => {
      const m = o.id.match(/^ORD-(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const max = nums.length ? Math.max(...nums) : 8000;
  return `ORD-${max + 1}`;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  /** FASE DE PRUEBAS: carga pedidos desde localStorage. BACKEND: cargar con GET /orders (o por usuario GET /orders?userId=...). */
  private ordersSignal = signal<Order[]>(this.loadFromStorage());

  readonly orders = this.ordersSignal.asReadonly();

  readonly ordersByStatus = computed(() => {
    const all = this.ordersSignal();
    return (status: OrderStatus | 'todos') => {
      if (status === 'todos') return all;
      return all.filter((o) => o.status === status);
    };
  });

  /** FASE DE PRUEBAS: carga pedidos desde localStorage. BACKEND: eliminar; datos desde API. */
  private loadFromStorage(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (raw) {
        const parsed = JSON.parse(raw) as Order[];
        if (Array.isArray(parsed)) {
          return parsed.map((o) => ({
            ...o,
            date: new Date(o.date),
            deliveryType: o.deliveryType ?? 'envio',
            items: (o.items ?? []).map((i) => ({
              ...i,
              product: { ...i.product },
            })),
          }));
        }
      }
    } catch {
      // ignorar
    }
    return [];
  }

  /** FASE DE PRUEBAS: guarda pedidos en localStorage. BACKEND: eliminar; cambios vía API. */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.ordersSignal()));
    } catch {
      // ignorar
    }
  }

  /** FASE DE PRUEBAS: filtra en memoria. BACKEND: GET /orders?userId=... o GET /me/orders. */
  getOrdersByUser(userId: string): Order[] {
    return this.ordersSignal().filter((o) => o.userId === userId);
  }

  /**
   * FASE DE PRUEBAS: crea pedido en memoria y localStorage (comprobante en data URL).
   * BACKEND: reemplazar por POST /orders con body (items, total, etc.) y subida de archivo del comprobante (multipart o base64 según API).
   */
  addOrder(params: {
    items: CartItem[];
    total: number;
    shippingAddressId: string;
    userId: string;
    deliveryType: 'envio' | 'retiro';
    proofDataUrl?: string;
    proofFileName?: string;
    proofMimeType?: string;
  }): Order {
    const list = this.ordersSignal();
    const order: Order = {
      id: nextOrderId(list),
      date: new Date(),
      total: params.total,
      status: 'validando_pago',
      items: params.items.map((i) => ({
        product: { ...i.product },
        quantity: i.quantity,
      })),
      shippingAddressId: params.shippingAddressId,
      userId: params.userId,
      deliveryType: params.deliveryType,
      proofUploaded: true,
      proofDataUrl: params.proofDataUrl,
      proofFileName: params.proofFileName,
      proofMimeType: params.proofMimeType,
    };
    this.ordersSignal.update((l) => [order, ...l]);
    this.saveToStorage();
    return order;
  }

  /** BACKEND: puede ser GET /orders/:id. */
  getOrderById(id: string): Order | undefined {
    return this.ordersSignal().find((o) => o.id === id);
  }

  /** FASE DE PRUEBAS: actualiza estado en memoria y localStorage. BACKEND: reemplazar por PATCH /orders/:id (status). */
  updateStatus(orderId: string, status: OrderStatus): void {
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    this.saveToStorage();
  }

  readonly pendingCount = computed(
    () => this.ordersSignal().filter((o) => o.status === 'validando_pago').length
  );

  readonly todayRevenue = computed(() => {
    const today = new Date().toDateString();
    return this.ordersSignal()
      .filter((o) => new Date(o.date).toDateString() === today && o.status === 'completado')
      .reduce((sum, o) => sum + o.total, 0);
  });
}
