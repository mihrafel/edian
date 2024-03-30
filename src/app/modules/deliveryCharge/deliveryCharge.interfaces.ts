// Define your interfaces here
// deliveryChargeInterfaces.ts

// Define your interfaces related to delivery charge here
export type IDeliveryChargeFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  // Add more fields as needed
};

// Add more interfaces as needed
export interface IDeliveryCharge {
  id: number;
  name: string;
  flatCharge?: number | null;
  orderCostSlabs: IOrderCostSlab[];
  orderVolumeSlabs: IOrderVolumeSlab[];
}

export interface IOrderCostSlab {
  id: number;
  fromCost: number;
  toCost: number;
  deliveryCharge: number;
  mappingBaseId: number;
}

export interface IOrderVolumeSlab {
  id: number;
  fromWeight: number;
  toWeight: number;
  deliveryCharge: number;
  mappingBaseId: number;
}
