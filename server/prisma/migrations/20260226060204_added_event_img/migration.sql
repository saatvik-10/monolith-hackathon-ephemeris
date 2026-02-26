/*
  Warnings:

  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - Added the required column `image` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_token_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "token";
