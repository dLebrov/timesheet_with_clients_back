/*
  Warnings:

  - You are about to drop the column `userId` on the `client_subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "client_subjects" DROP CONSTRAINT "client_subjects_userId_fkey";

-- AlterTable
ALTER TABLE "client_subjects" DROP COLUMN "userId",
ADD COLUMN     "usersId" INTEGER;

-- AddForeignKey
ALTER TABLE "client_subjects" ADD CONSTRAINT "client_subjects_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
