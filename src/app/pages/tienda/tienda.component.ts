import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ProductCardComponent],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss',
})
export class TiendaComponent {
  private productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly categories = this.productService.getCategories();
  readonly currentCategory = this.productService.currentCategory;

  setCategory(category: ProductCategory): void {
    this.productService.setCategory(category);
  }

  loadMore(): void {
    // TODO: paginación o carga infinita
  }
}
