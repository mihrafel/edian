// Define your constants here
export const productFilterableFields: string[] = [
  'searchTerm',
  'id',
  'title',
  'stock',
  'price',
  'minPrice',
  'maxPrice',
  'categoryId',
  'productTags',
];

export const productSearchableFields: string[] = ['title', 'id'];

export const productRelationalFields: string[] = [
  'categoryId',
  // 'minPrice',
  // 'maxPrice',
];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'category',
};
