// order.interfaces.ts

import { OrderStatus } from '@prisma/client';

export type IAssignOrderToDPFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  orderId?: string | undefined; // Change this to string if userId is a string
};

export type ICombinedFilterRequest = {
  searchTerm?: string; // Optional search term for various fields
  userId?: number; // Filter by specific user ID
  status?: OrderStatus; // Filter by order status
  isCashOnDelivery?: boolean; // Filter by cash on delivery option

  // Additional filters from IAssignOrderToDPFilterRequest (if needed)
  // ...

  // Additional filters from IOrderFilterRequest (if needed)
  // ...
};

export type AssignOrderToDPStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'INPROGRESS'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';
