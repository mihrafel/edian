-- AlterTable
ALTER TABLE "assign_order_to_dps" ADD COLUMN     "assigningTime" TEXT,
ADD COLUMN     "deliveryDurationFromRecieveMinutes" TEXT,
ADD COLUMN     "inProgressTime" TEXT,
ADD COLUMN     "orderDeliveredTime" TEXT,
ADD COLUMN     "orderExcutionTimeMinutes" TEXT,
ADD COLUMN     "orderInProgressMinutes" TEXT,
ADD COLUMN     "orderReceivedTime" TEXT,
ADD COLUMN     "orderTime" TEXT;
