/*
  Warnings:

  - You are about to drop the `DeliveryChargeMappingBase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderCostSlab" DROP CONSTRAINT "OrderCostSlab_mappingBaseId_fkey";

-- DropForeignKey
ALTER TABLE "OrderVolumeSlab" DROP CONSTRAINT "OrderVolumeSlab_mappingBaseId_fkey";

-- DropTable
DROP TABLE "DeliveryChargeMappingBase";

-- CreateTable
CREATE TABLE "deliveryChargeMappingBase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "flatCharge" INTEGER,

    CONSTRAINT "deliveryChargeMappingBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deliveryChargeMappingBase_name_key" ON "deliveryChargeMappingBase"("name");

-- AddForeignKey
ALTER TABLE "OrderCostSlab" ADD CONSTRAINT "OrderCostSlab_mappingBaseId_fkey" FOREIGN KEY ("mappingBaseId") REFERENCES "deliveryChargeMappingBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderVolumeSlab" ADD CONSTRAINT "OrderVolumeSlab_mappingBaseId_fkey" FOREIGN KEY ("mappingBaseId") REFERENCES "deliveryChargeMappingBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
