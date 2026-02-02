import { CartItem } from './cart.model';

export type OrderStatus =
  | 'validando_pago'
  | 'enviado'
  | 'completado';

/** Envío a domicilio o retiro en local */
export type DeliveryType = 'envio' | 'retiro';

export interface Order {
  id: string;
  date: Date;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  shippingAddressId: string;
  userId: string; // cliente que realizó el pedido
  /** Entrega: envío a domicilio o retiro en local */
  deliveryType: DeliveryType;
  proofUploaded?: boolean;
  /** Comprobante de pago en data URL (para que el admin pueda visualizarlo) */
  proofDataUrl?: string;
  proofFileName?: string;
  proofMimeType?: string;
}
