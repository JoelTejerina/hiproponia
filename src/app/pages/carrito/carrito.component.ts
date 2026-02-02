import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ShippingAddress } from '../../models/cart.model';

// FASE DE PRUEBAS: dirección de envío mock. BACKEND: reemplazar por GET /me/addresses (o similar) y permitir crear/editar direcciones.
const MOCK_ADDRESSES: ShippingAddress[] = [
  {
    id: '1',
    label: 'Casa / Oficina',
    line1: 'Av. Hidroponía 123, Zona Verde',
    city: 'Ciudad Jardín',
    postalCode: '40000',
  },
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent {
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);
  protected selectedAddressId = signal<string>(MOCK_ADDRESSES[0].id);
  protected deliveryType = signal<'envio' | 'retiro'>('envio');
  protected addresses = MOCK_ADDRESSES;
  protected currentYear = new Date().getFullYear();

  protected proofFile = signal<File | null>(null);
  protected proofError = signal<string | null>(null);

  readonly items = this.cart.items;
  readonly subtotal = this.cart.subtotal;
  readonly shipping = this.cart.shipping;
  readonly tax = this.cart.tax;
  readonly total = this.cart.total;
  readonly hasFreeShipping = this.cart.hasFreeShipping;

  removeItem(productId: string): void {
    this.cart.removeItem(productId);
  }

  setQuantity(productId: string, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  onProofFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    this.proofError.set(null);
    this.proofFile.set(null);

    if (!file) return;

    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    const mimeValid = ALLOWED_MIMES.includes(file.type);
    const extValid = ALLOWED_EXTENSIONS.includes(ext);

    if (extValid && mimeValid) {
      this.proofFile.set(file);
    } else {
      this.proofError.set(
        'El formato del archivo no es válido. Solo se permiten PDF, JPG o PNG.'
      );
    }
  }

  removeProofFile(): void {
    this.proofFile.set(null);
    this.proofError.set(null);
  }

  setDeliveryType(type: 'envio' | 'retiro'): void {
    this.deliveryType.set(type);
  }

  placeOrder(): void {
    const file = this.proofFile();
    const items = this.cart.items();
    const total = this.cart.total();
    const userId = this.auth.currentUserId();
    if (!userId || !file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const proofDataUrl = reader.result as string;
      this.orderService.addOrder({
        items,
        total,
        shippingAddressId: this.selectedAddressId(),
        userId,
        deliveryType: this.deliveryType(),
        proofDataUrl,
        proofFileName: file.name,
        proofMimeType: file.type,
      });
      this.proofFile.set(null);
      this.proofError.set(null);
      this.cart.clear();
      this.router.navigate(['/pedidos']);
    };
    reader.readAsDataURL(file);
  }
}
