/*
  Warnings:

  - You are about to drop the column `description` on the `Iteration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Iteration" DROP COLUMN "description",
ADD COLUMN     "tag" VARCHAR(255);
