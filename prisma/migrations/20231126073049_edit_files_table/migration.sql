/*
  Warnings:

  - You are about to drop the column `status` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "status",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
