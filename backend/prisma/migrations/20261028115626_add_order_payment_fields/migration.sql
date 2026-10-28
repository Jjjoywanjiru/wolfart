-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'DEPOSIT_PAID', 'PAID');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "balancePaidAt" TIMESTAMP(3),
ADD COLUMN     "depositPaidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
