// order.interfaces.ts

import { Prisma } from '@prisma/client';

export type IOrderFilterRequest = {
  searchTerm?: string | undefined;
  userId?: string | undefined; // Change this to string if userId is a string
  status?: string | undefined;
  isCashOnDelivery?: boolean | undefined;
};

export type OrderInput = {
  userId: number;
  paymentId: string | null;
  isCashOnDelivery: boolean;
  status: OrderStatus;
  totalAmount: number;
  orderItems: OrderItemInput[];
  platformCharge: number;
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type OrderWhereInput = Prisma.OrderWhereInput; // Use Prisma's generated type

export type JsonNullableListFilter = {
  // Add filters for order-related JSON fields if needed
};

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'INPROGRESS'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';
