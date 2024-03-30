/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Prisma } from '@prisma/client';

// Define your interfaces here
export type IProductFilterRequest = {
  searchTerm?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  productTags?: string | undefined;
};

export type ProductInput = {
  title: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  unit: string;
  sell: number;
  productImages: CloudinaryUploadFile[]; // Assuming you have a CloudinaryUploadFile interface
  productTags: string[];
  discount: number | undefined;
  afterDiscountPrice: number | undefined;
  userId: number;
  vat: number | undefined;
};

export type ProductWhereInput = {
  AND?: ProductWhereInput[];
  OR?: ProductWhereInput[];
  id?: string;
  title?: string;
  description?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  stock?: number;
  unit?: string;
  sell?: number;
  // productImages: CloudinaryUploadFile[];
  productTags?: {
    hasEvery?: string[];
  };
  // discount: number;
  // afterDiscountPrice: number;
};

export type JsonNullableListFilter<> = {
  productTags?: Prisma.JsonNullableListFilter | undefined;
  // Add other filters if needed
};

export type CloudinaryUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  public_id?: string; // Add this line to include public_id property
};
