import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-inventario.component.html',
  styleUrl: './admin-inventario.component.scss',
})
export class AdminInventarioComponent {
  private productService = inject(ProductService);

  readonly products = this.productService.allProducts;
  readonly lowStockProducts = this.productService.lowStockProducts;

  isLowStock(p: Product): boolean {
    return p.stock < p.minStock;
  }

  updateStock(productId: string, newStock: number, newMinStock?: number): void {
    if (newStock < 0) return;
    this.productService.updateStock(
      productId,
      newStock,
      newMinStock !== undefined ? newMinStock : undefined
    );
  }
}
