/*
  Warnings:

  - You are about to drop the column `tempUnit` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Instruction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "tempUnit",
DROP COLUMN "temperature";

-- CreateTable
CREATE TABLE "Temperature" (
    "instructionId" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "unit" "TemperatureUnit" DEFAULT 'C'
);

-- CreateIndex
CREATE UNIQUE INDEX "Temperature_instructionId_key" ON "Temperature"("instructionId");

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "Temperature_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
