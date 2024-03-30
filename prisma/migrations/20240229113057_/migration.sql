-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "platformCharge" INTEGER;

-- CreateTable
CREATE TABLE "DeliveryChargeMappingBase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "flatCharge" INTEGER,

    CONSTRAINT "DeliveryChargeMappingBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCostSlab" (
    "id" SERIAL NOT NULL,
    "fromCost" INTEGER NOT NULL,
    "toCost" INTEGER NOT NULL,
    "deliveryCharge" INTEGER NOT NULL,
    "mappingBaseId" INTEGER NOT NULL,

    CONSTRAINT "OrderCostSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderVolumeSlab" (
    "id" SERIAL NOT NULL,
    "fromWeight" INTEGER NOT NULL,
    "toWeight" INTEGER NOT NULL,
    "deliveryCharge" INTEGER NOT NULL,
    "mappingBaseId" INTEGER NOT NULL,

    CONSTRAINT "OrderVolumeSlab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryChargeMappingBase_name_key" ON "DeliveryChargeMappingBase"("name");

-- AddForeignKey
ALTER TABLE "OrderCostSlab" ADD CONSTRAINT "OrderCostSlab_mappingBaseId_fkey" FOREIGN KEY ("mappingBaseId") REFERENCES "DeliveryChargeMappingBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderVolumeSlab" ADD CONSTRAINT "OrderVolumeSlab_mappingBaseId_fkey" FOREIGN KEY ("mappingBaseId") REFERENCES "DeliveryChargeMappingBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
