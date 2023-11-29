/*
  Warnings:

  - Made the column `folderId` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `folderId` on table `folderPermissions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `folderPermissions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_folderId_fkey";

-- DropForeignKey
ALTER TABLE "folderPermissions" DROP CONSTRAINT "folderPermissions_folderId_fkey";

-- DropForeignKey
ALTER TABLE "folderPermissions" DROP CONSTRAINT "folderPermissions_userId_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "folderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "folderPermissions" ALTER COLUMN "folderId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folderPermissions" ADD CONSTRAINT "folderPermissions_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folderPermissions" ADD CONSTRAINT "folderPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
