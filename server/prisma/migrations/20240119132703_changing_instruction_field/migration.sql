/*
  Warnings:

  - You are about to drop the column `time` on the `Instruction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "time";

-- CreateTable
CREATE TABLE "Time" (
    "instructionId" TEXT NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Time_instructionId_key" ON "Time"("instructionId");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
