// Define your constants here

export const deliveryChargeMappingBases: string[] = [
  'Flat',
  'Order Cost Wise',
  'Order Volume Wise',
];

export const deliveryFilterableFields: string[] = ['searchTerm', 'id'];

export const orderCostSlabFields: string[] = [
  'fromCost',
  'toCost',
  'deliveryCharge',
];

export const orderVolumeSlabFields: string[] = [
  'fromWeight',
  'toWeight',
  'deliveryCharge',
];
