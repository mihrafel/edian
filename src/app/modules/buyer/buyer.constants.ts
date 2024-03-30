// Define your constants here
// Define your constants here
export const buyerFilterableFields: string[] = ['searchTerm', 'id', 'zoneId'];

export const buyerSearchableFields: string[] = [
  'mobileNumber',
  'username',
  'email',
];

export const buyerRelationalFields: string[] = ['zoneId'];
export const buyerRelationalFieldsMapper: { [key: string]: string } = {
  zoneId: 'zone',
};
