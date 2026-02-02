import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';
import { OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private userService = inject(UserService);

  readonly pendingOrders = this.orderService.pendingCount;
  readonly lowStockCount = this.productService.lowStockProducts;
  readonly todayRevenue = this.orderService.todayRevenue;
  readonly orders = this.orderService.orders;
  readonly lowStockProducts = this.productService.lowStockProducts;

  getClientName(userId: string): string {
    const user = this.userService.getUserById(userId);
    return user ? user.razonSocial || user.username : '—';
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      validando_pago: 'Validando',
      enviado: 'Enviado',
      completado: 'Completado',
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status}`;
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
