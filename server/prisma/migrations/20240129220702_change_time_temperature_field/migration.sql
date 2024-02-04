/*
  Warnings:

  - You are about to drop the `TemperatureIteration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeIteration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TemperatureIteration" DROP CONSTRAINT "TemperatureIteration_iterationId_instructionStep_fkey";

-- DropForeignKey
ALTER TABLE "TimeIteration" DROP CONSTRAINT "TimeIteration_iterationId_instructionStep_fkey";

-- DropTable
DROP TABLE "TemperatureIteration";

-- DropTable
DROP TABLE "TimeIteration";

-- CreateTable
CREATE TABLE "TimeAndTemperatureIteration" (
    "iterationId" TEXT NOT NULL,
    "instructionStep" INTEGER NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER,
    "temperature" INTEGER NOT NULL,
    "unit" "TemperatureUnit" DEFAULT 'C'
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeAndTemperatureIteration_iterationId_instructionStep_key" ON "TimeAndTemperatureIteration"("iterationId", "instructionStep");

-- AddForeignKey
ALTER TABLE "TimeAndTemperatureIteration" ADD CONSTRAINT "TimeAndTemperatureIteration_iterationId_instructionStep_fkey" FOREIGN KEY ("iterationId", "instructionStep") REFERENCES "InstructionIteration"("iterationId", "step") ON DELETE CASCADE ON UPDATE CASCADE;
