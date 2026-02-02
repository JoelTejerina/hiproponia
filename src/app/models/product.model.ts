export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  unit?: string;
  stock: number;
  minStock: number;
}

export type ProductCategory =
  | 'todos'
  | 'hojas'
  | 'frutos'
  | 'hortalizas'
  | 'hierbas';
