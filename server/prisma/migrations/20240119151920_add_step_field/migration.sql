/*
  Warnings:

  - Added the required column `step` to the `Instruction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instruction" ADD COLUMN     "step" INTEGER NOT NULL;
