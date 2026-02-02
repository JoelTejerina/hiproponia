import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  id: string;
  label: string;
  line1: string;
  city: string;
  postalCode: string;
}

export type PaymentMethod = 'card' | 'transfer';
