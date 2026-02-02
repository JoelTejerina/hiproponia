import { Component, input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private cart = inject(CartService);
  private snackBar = inject(MatSnackBar);
  product = input.required<Product>();
  readonly placeholderImg = PLACEHOLDER_IMG;

  addToCart(): void {
    const p = this.product();
    this.cart.addItem(p);
    this.snackBar.open(`${p.name} añadido al carrito`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
