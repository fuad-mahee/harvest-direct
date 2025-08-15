-- AlterEnum
ALTER TYPE "public"."NotificationType" ADD VALUE 'NEW_PRODUCT';

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "relatedEntityId" TEXT,
ADD COLUMN     "relatedEntityType" TEXT;
