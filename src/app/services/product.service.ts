import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductCategory } from '../models/product.model';

// ========== FASE DE PRUEBAS (sin backend) ==========
// Con backend: catálogo, stock y minStock vendrán del API (GET /products, PATCH /products/:id para inventario).

const STORAGE_KEY_PRODUCTS = 'hidroponia_products';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Lechuga Hidropónica Romana', price: 45, description: 'Lechuga fresca cultivada sin suelo, crujiente y libre de pesticidas.', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a9?w=400', category: 'hojas', unit: 'pieza', stock: 25, minStock: 10 },
  { id: '2', name: 'Tomate Cherry Hidropónico', price: 85, description: 'Tomates cherry dulces, cultivados en sistema NFT. Ideal para ensaladas.', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', category: 'frutos', unit: '500g', stock: 15, minStock: 10 },
  { id: '3', name: 'Espinaca Baby Hidropónica', price: 55, description: 'Hojas tiernas de espinaca, ricas en hierro y vitaminas.', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', category: 'hojas', unit: '250g', stock: 2, minStock: 10 },
  { id: '4', name: 'Pepino Hidropónico', price: 35, description: 'Pepinos frescos y crujientes, perfectos para ensaladas o snacks.', imageUrl: 'https://images.unsplash.com/photo-1604977042946-077ee2c2f1c4?w=400', category: 'hortalizas', unit: 'kg', stock: 5, minStock: 10 },
  { id: '5', name: 'Albahaca Fresca', price: 40, description: 'Albahaca cultivada en hidroponía, aroma intenso para tus recetas.', imageUrl: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400', category: 'hierbas', unit: 'manojo', stock: 18, minStock: 5 },
  { id: '6', name: 'Rúcula Hidropónica', price: 50, description: 'Rúcula de sabor ligeramente picante, ideal para ensaladas gourmet.', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4994?w=400', category: 'hojas', unit: '150g', stock: 1, minStock: 5 },
  { id: '7', name: 'Pimiento Morrón Rojo', price: 95, description: 'Pimientos dulces cultivados sin suelo, color intenso y sabor fresco.', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', category: 'frutos', unit: 'kg', stock: 12, minStock: 5 },
  { id: '8', name: 'Cilantro Hidropónico', price: 38, description: 'Cilantro fresco, sin tierra ni residuos. Listo para cocinar.', imageUrl: 'https://images.unsplash.com/photo-1600326145552-327f74f2c43b?w=400', category: 'hierbas', unit: 'manojo', stock: 22, minStock: 5 },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  /** FASE DE PRUEBAS: carga productos desde localStorage. BACKEND: cargar con GET /products. */
  private productsSignal = signal<Product[]>(this.loadFromStorage());
  private categoryFilter = signal<ProductCategory>('todos');
  private searchQuery = signal('');

  readonly currentCategory = this.categoryFilter;

  readonly allProducts = this.productsSignal.asReadonly();

  readonly products = computed(() => {
    const all = this.productsSignal();
    const category = this.categoryFilter();
    const query = this.searchQuery().toLowerCase().trim();
    return all.filter((p) => {
      const matchCategory = category === 'todos' || p.category === category;
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  });

  readonly lowStockProducts = computed(() =>
    this.productsSignal().filter((p) => p.stock < p.minStock)
  );

  setCategory(cat: ProductCategory): void {
    this.categoryFilter.set(cat);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
  }

  /** FASE DE PRUEBAS: carga productos desde localStorage. BACKEND: eliminar; datos desde API. */
  private loadFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const byId = new Map(MOCK_PRODUCTS.map((p) => [p.id, p]));
          return parsed.map((p) => {
            const defaultProduct = byId.get(p.id);
            return defaultProduct
              ? { ...p, imageUrl: defaultProduct.imageUrl }
              : p;
          });
        }
      }
    } catch {}
    return [...MOCK_PRODUCTS];
  }

  /** FASE DE PRUEBAS: guarda productos en localStorage. BACKEND: eliminar; cambios vía API. */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.productsSignal()));
    } catch {}
  }

  getCategories(): { id: ProductCategory; label: string }[] {
    return [
      { id: 'todos', label: 'Todos' },
      { id: 'hojas', label: 'Hojas' },
      { id: 'frutos', label: 'Frutos' },
      { id: 'hortalizas', label: 'Hortalizas' },
      { id: 'hierbas', label: 'Hierbas' },
    ];
  }

  /**
   * FASE DE PRUEBAS: actualiza stock/minStock en memoria y localStorage.
   * BACKEND: reemplazar por PATCH /products/:id (stock, minStock) desde admin inventario.
   */
  updateStock(productId: string, stock: number, minStock?: number): void {
    this.productsSignal.update((list) =>
      list.map((p) =>
        p.id === productId
          ? { ...p, stock, ...(minStock != null ? { minStock } : {}) }
          : p
      )
    );
    this.saveToStorage();
  }
}
