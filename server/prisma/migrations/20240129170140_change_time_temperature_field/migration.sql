/*
  Warnings:

  - The primary key for the `Instruction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the `Temperature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Temperature" DROP CONSTRAINT "Temperature_instructionId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_instructionId_fkey";

-- AlterTable
ALTER TABLE "Instruction" DROP CONSTRAINT "Instruction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Instruction_pkey" PRIMARY KEY ("recipeId", "step");

-- DropTable
DROP TABLE "Temperature";

-- DropTable
DROP TABLE "Time";

-- CreateTable
CREATE TABLE "TimeAndTemperature" (
    "recipeId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER,
    "temperature" INTEGER,
    "unit" "TemperatureUnit" DEFAULT 'C'
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeAndTemperature_recipeId_step_key" ON "TimeAndTemperature"("recipeId", "step");

-- AddForeignKey
ALTER TABLE "TimeAndTemperature" ADD CONSTRAINT "TimeAndTemperature_recipeId_step_fkey" FOREIGN KEY ("recipeId", "step") REFERENCES "Instruction"("recipeId", "step") ON DELETE CASCADE ON UPDATE CASCADE;
