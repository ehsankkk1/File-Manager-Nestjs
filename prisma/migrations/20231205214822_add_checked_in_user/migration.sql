-- AlterTable
ALTER TABLE "files" ADD COLUMN     "checkedInUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_checkedInUserId_fkey" FOREIGN KEY ("checkedInUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
