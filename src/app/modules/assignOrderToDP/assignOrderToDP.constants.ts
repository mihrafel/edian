// Define your constants here

export const assignOrderToDPFilterableFields: string[] = [
  'searchTerm',
  'id',
  'orderId',
];

export const assignOrderToDPSearchableFields: string[] = ['id']; // You can add more fields if needed

export const assignOrderToDPRelationalFields: string[] = ['orderId'];

export const assignOrderToDPRelationalFieldsMapper: { [key: string]: string } =
  {
    orderId: 'order', // Assuming a relation between Order and User
  };

export const assignOrderToDPStatusOptions: string[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'INPROGRESS',
  'DELIVERED',
  'CANCELED',
];
