// order.constants.ts

export const orderFilterableFields: string[] = [
  'searchTerm',
  'id',
  'userId',
  'status',
];

export const orderSearchableFields: string[] = ['status']; // You can add more fields if needed

export const orderRelationalFields: string[] = ['userId'];

export const orderRelationalFieldsMapper: { [key: string]: string } = {
  userId: 'user', // Assuming a relation between Order and User
};

export const orderStatusOptions: string[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'INPROGRESS',
  'DELIVERED',
  'CANCELED',
];
