import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { Order, OrderStatus } from '../../../models/order.model';
import { ViewProofDialogComponent } from '../../../components/view-proof-dialog/view-proof-dialog.component';

const STATUS_LABELS: Record<OrderStatus, string> = {
  validando_pago: 'Validando pago',
  enviado: 'Enviado',
  completado: 'Completado',
};

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule, MatIconModule, MatSelectModule, MatDialogModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrl: './admin-pedidos.component.scss',
})
export class AdminPedidosComponent {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  readonly orders = this.orderService.orders;
  readonly statusOptions: OrderStatus[] = ['validando_pago', 'enviado', 'completado'];
  readonly statusLabels = STATUS_LABELS;

  openViewProof(order: Order): void {
    this.dialog.open(ViewProofDialogComponent, {
      data: { order },
      width: 'min(720px, 95vw)',
      maxHeight: '90vh',
    });
  }

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

  updateStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateStatus(orderId, status);
  }
}
