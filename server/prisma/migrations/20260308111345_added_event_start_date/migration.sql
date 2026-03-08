/*
  Warnings:

  - You are about to drop the column `endTime` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endTime",
ADD COLUMN     "startDate" DATE NOT NULL;
