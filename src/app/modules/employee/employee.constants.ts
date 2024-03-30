// Define your constants here
// Define your constants here
// Define your constants here
export const employeeFilterableFields: string[] = [
  'searchTerm',
  'zoneId',
  'types',
  'joiningDate',
];

export const employeeSearchableFields: string[] = ['nidNumber', 'name', 'id'];

export const employeeRelationalFields: string[] = ['zoneId'];
export const employeeRelationalFieldsMapper: { [key: string]: string } = {
  zoneId: 'zone',
};
