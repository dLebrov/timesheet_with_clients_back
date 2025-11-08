-- AlterTable
ALTER TABLE "records" ADD COLUMN     "subjectId" INTEGER;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
