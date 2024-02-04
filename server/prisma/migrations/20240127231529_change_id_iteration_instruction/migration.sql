/*
  Warnings:

  - The primary key for the `IngredientIteration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipeId` on the `IngredientIteration` table. All the data in the column will be lost.
  - The primary key for the `InstructionIteration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipeId` on the `InstructionIteration` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `TemperatureIteration` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `TimeIteration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iterationId,instructionStep]` on the table `TemperatureIteration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iterationId,instructionStep]` on the table `TimeIteration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iterationId` to the `IngredientIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iterationId` to the `InstructionIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iterationId` to the `TemperatureIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iterationId` to the `TimeIteration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredientIteration" DROP CONSTRAINT "IngredientIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "InstructionIteration" DROP CONSTRAINT "InstructionIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "TemperatureIteration" DROP CONSTRAINT "TemperatureIteration_recipeId_instructionStep_fkey";

-- DropForeignKey
ALTER TABLE "TimeIteration" DROP CONSTRAINT "TimeIteration_recipeId_instructionStep_fkey";

-- DropIndex
DROP INDEX "TemperatureIteration_recipeId_instructionStep_key";

-- DropIndex
DROP INDEX "TimeIteration_recipeId_instructionStep_key";

-- AlterTable
ALTER TABLE "IngredientIteration" DROP CONSTRAINT "IngredientIteration_pkey",
DROP COLUMN "recipeId",
ADD COLUMN     "iterationId" TEXT NOT NULL,
ADD CONSTRAINT "IngredientIteration_pkey" PRIMARY KEY ("iterationId", "ingredientId");

-- AlterTable
ALTER TABLE "InstructionIteration" DROP CONSTRAINT "InstructionIteration_pkey",
DROP COLUMN "recipeId",
ADD COLUMN     "iterationId" TEXT NOT NULL,
ADD CONSTRAINT "InstructionIteration_pkey" PRIMARY KEY ("iterationId", "step");

-- AlterTable
ALTER TABLE "TemperatureIteration" DROP COLUMN "recipeId",
ADD COLUMN     "iterationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeIteration" DROP COLUMN "recipeId",
ADD COLUMN     "iterationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TemperatureIteration_iterationId_instructionStep_key" ON "TemperatureIteration"("iterationId", "instructionStep");

-- CreateIndex
CREATE UNIQUE INDEX "TimeIteration_iterationId_instructionStep_key" ON "TimeIteration"("iterationId", "instructionStep");

-- AddForeignKey
ALTER TABLE "IngredientIteration" ADD CONSTRAINT "IngredientIteration_iterationId_fkey" FOREIGN KEY ("iterationId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionIteration" ADD CONSTRAINT "InstructionIteration_iterationId_fkey" FOREIGN KEY ("iterationId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeIteration" ADD CONSTRAINT "TimeIteration_iterationId_instructionStep_fkey" FOREIGN KEY ("iterationId", "instructionStep") REFERENCES "InstructionIteration"("iterationId", "step") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemperatureIteration" ADD CONSTRAINT "TemperatureIteration_iterationId_instructionStep_fkey" FOREIGN KEY ("iterationId", "instructionStep") REFERENCES "InstructionIteration"("iterationId", "step") ON DELETE CASCADE ON UPDATE CASCADE;
