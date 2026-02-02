import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus } from '../../models/order.model';

type FilterTab = 'todos' | OrderStatus;

const STATUS_LABELS: Record<OrderStatus, string> = {
  validando_pago: 'Validando Pago',
  enviado: 'Enviado',
  completado: 'Completado',
};

const PAGE_SIZE = 4;

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [RouterLink, DecimalPipe, MatButtonModule, MatIconModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss',
})
export class PedidosComponent {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  protected filterTab = signal<FilterTab>('todos');
  protected currentPage = signal(1);

  /** Solo pedidos del usuario actual. */
  readonly orders = computed(() => {
    const userId = this.auth.currentUserId();
    if (!userId) return [];
    return this.orderService.getOrdersByUser(userId);
  });

  readonly filteredOrders = computed(() => {
    const all = this.orders();
    const filter = this.filterTab();
    if (filter === 'todos') return all;
    return all.filter((o) => o.status === filter);
  });

  readonly paginatedOrders = computed(() => {
    const list = this.filteredOrders();
    const page = this.currentPage();
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  });

  readonly totalFiltered = computed(() => this.filteredOrders().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalFiltered() / PAGE_SIZE))
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly statusLabels = STATUS_LABELS;

  setFilter(filter: FilterTab): void {
    this.filterTab.set(filter);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())));
  }

  /** Etiqueta según estado y tipo de entrega: En camino (envío) o Listo para retiro (retiro). */
  getStatusLabel(order: Order): string {
    if (order.status === 'validando_pago') return 'Validando Pago';
    if (order.status === 'completado') return 'Completado';
    if (order.status === 'enviado') {
      return order.deliveryType === 'retiro' ? 'Listo para retiro' : 'En camino';
    }
    return STATUS_LABELS[order.status];
  }

  getStatusClass(status: OrderStatus): string {
    return `status-badge status-${status}`;
  }

  formatDate(date: Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  getOrderDisplayId(order: Order): string {
    return `#${order.id}`;
  }
}
