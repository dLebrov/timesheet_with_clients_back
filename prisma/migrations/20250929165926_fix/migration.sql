/*
  Warnings:

  - Added the required column `userId` to the `client_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client_subjects" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "records" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_subjects" ADD CONSTRAINT "client_subjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
