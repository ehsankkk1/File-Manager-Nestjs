-- DropForeignKey
ALTER TABLE "fileEvents" DROP CONSTRAINT "fileEvents_fileId_fkey";

-- DropForeignKey
ALTER TABLE "fileEvents" DROP CONSTRAINT "fileEvents_userId_fkey";

-- AddForeignKey
ALTER TABLE "fileEvents" ADD CONSTRAINT "fileEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fileEvents" ADD CONSTRAINT "fileEvents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
