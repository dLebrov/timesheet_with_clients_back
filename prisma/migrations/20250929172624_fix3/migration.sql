/*
  Warnings:

  - You are about to drop the column `usersId` on the `client_subjects` table. All the data in the column will be lost.
  - Added the required column `userId` to the `client_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "client_subjects" DROP CONSTRAINT "client_subjects_usersId_fkey";

-- AlterTable
ALTER TABLE "client_subjects" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "client_subjects" ADD CONSTRAINT "client_subjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
