/*
  Warnings:

  - The primary key for the `InstructionIteration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InstructionIteration` table. All the data in the column will be lost.
  - You are about to drop the column `instructionId` on the `TemperatureIteration` table. All the data in the column will be lost.
  - You are about to drop the column `instructionId` on the `TimeIteration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipeId,instructionStep]` on the table `TemperatureIteration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,instructionStep]` on the table `TimeIteration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructionStep` to the `TemperatureIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `TemperatureIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructionStep` to the `TimeIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `TimeIteration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TemperatureIteration" DROP CONSTRAINT "TemperatureIteration_instructionId_fkey";

-- DropForeignKey
ALTER TABLE "TimeIteration" DROP CONSTRAINT "TimeIteration_instructionId_fkey";

-- DropIndex
DROP INDEX "TemperatureIteration_instructionId_key";

-- DropIndex
DROP INDEX "TimeIteration_instructionId_key";

-- AlterTable
ALTER TABLE "InstructionIteration" DROP CONSTRAINT "InstructionIteration_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "InstructionIteration_pkey" PRIMARY KEY ("recipeId", "step");

-- AlterTable
ALTER TABLE "TemperatureIteration" DROP COLUMN "instructionId",
ADD COLUMN     "instructionStep" INTEGER NOT NULL,
ADD COLUMN     "recipeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeIteration" DROP COLUMN "instructionId",
ADD COLUMN     "instructionStep" INTEGER NOT NULL,
ADD COLUMN     "recipeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TemperatureIteration_recipeId_instructionStep_key" ON "TemperatureIteration"("recipeId", "instructionStep");

-- CreateIndex
CREATE UNIQUE INDEX "TimeIteration_recipeId_instructionStep_key" ON "TimeIteration"("recipeId", "instructionStep");

-- AddForeignKey
ALTER TABLE "TimeIteration" ADD CONSTRAINT "TimeIteration_recipeId_instructionStep_fkey" FOREIGN KEY ("recipeId", "instructionStep") REFERENCES "InstructionIteration"("recipeId", "step") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemperatureIteration" ADD CONSTRAINT "TemperatureIteration_recipeId_instructionStep_fkey" FOREIGN KEY ("recipeId", "instructionStep") REFERENCES "InstructionIteration"("recipeId", "step") ON DELETE CASCADE ON UPDATE CASCADE;
