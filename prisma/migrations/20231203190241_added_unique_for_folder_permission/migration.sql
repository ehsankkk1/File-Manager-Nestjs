/*
  Warnings:

  - A unique constraint covering the columns `[userId,folderId]` on the table `folderPermissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folderPermissions_userId_folderId_key" ON "folderPermissions"("userId", "folderId");
