/*
  Warnings:

  - Changed the type of `eventName` on the `fileEvents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventName" AS ENUM ('updated', 'deleted', 'created', 'checkedin', 'checkedout');

-- AlterTable
ALTER TABLE "fileEvents" DROP COLUMN "eventName",
ADD COLUMN     "eventName" "EventName" NOT NULL;
