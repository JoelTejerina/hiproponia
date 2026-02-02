import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { OrderStatus } from '../../../models/order.model';

const STATUS_LABELS: Record<OrderStatus, string> = {
  validando_pago: 'Validando pago',
  enviado: 'Enviado',
  completado: 'Completado',
};

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './admin-historial.component.html',
  styleUrl: './admin-historial.component.scss',
})
export class AdminHistorialComponent {
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  readonly orders = this.orderService.orders;
  readonly statusLabels = STATUS_LABELS;

  getClientName(userId: string): string {
    const user = this.userService.getUserById(userId);
    return user ? user.razonSocial || user.username : '—';
  }

  getStatusClass(status: OrderStatus): string {
    return `status-badge status-${status}`;
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
