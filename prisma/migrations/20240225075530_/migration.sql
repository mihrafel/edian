/*
  Warnings:

  - Added the required column `vat` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "totalPrice" INTEGER,
ADD COLUMN     "vat" INTEGER NOT NULL;
