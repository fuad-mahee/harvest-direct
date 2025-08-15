-- CreateEnum
CREATE TYPE "public"."FarmerProfileStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."FarmerProfile" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "farmAddress" TEXT NOT NULL,
    "farmSize" TEXT NOT NULL,
    "farmingPractices" TEXT[],
    "certifications" TEXT[],
    "aboutFarm" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "specialization" TEXT[],
    "experience" INTEGER,
    "status" "public"."FarmerProfileStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "certificationBadge" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarmerProfile_farmerId_key" ON "public"."FarmerProfile"("farmerId");

-- AddForeignKey
ALTER TABLE "public"."FarmerProfile" ADD CONSTRAINT "FarmerProfile_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
