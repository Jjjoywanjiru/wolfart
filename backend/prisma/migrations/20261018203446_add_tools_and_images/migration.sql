-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "tools" TEXT NOT NULL DEFAULT '';
