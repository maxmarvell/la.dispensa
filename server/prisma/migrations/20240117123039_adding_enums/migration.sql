/*
  Warnings:

  - You are about to drop the `Connections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IngreidentUnit" AS ENUM ('G', 'KG', 'CUP', 'ML', 'L', 'OZ');

-- CreateEnum
CREATE TYPE "TemperatureUnit" AS ENUM ('C', 'K');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'CONTRIBUTOR', 'EDITOR', 'AUTHOR');

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_connectedById_fkey";

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_connectedWithId_fkey";

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "unit" "IngreidentUnit";

-- DropTable
DROP TABLE "Connections";

-- CreateTable
CREATE TABLE "Connection" (
    "connectedWithId" TEXT NOT NULL,
    "connectedById" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("connectedWithId","connectedById")
);

-- CreateTable
CREATE TABLE "RecipePermission" (
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "Role" NOT NULL,

    CONSTRAINT "RecipePermission_pkey" PRIMARY KEY ("recipeId","userId")
);

-- CreateTable
CREATE TABLE "Instruction" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "instructionId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temperature" (
    "id" TEXT NOT NULL,
    "instructionId" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "unit" "TemperatureUnit" NOT NULL DEFAULT 'C',

    CONSTRAINT "Temperature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Time_instructionId_key" ON "Time"("instructionId");

-- CreateIndex
CREATE UNIQUE INDEX "Temperature_instructionId_key" ON "Temperature"("instructionId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_connectedWithId_fkey" FOREIGN KEY ("connectedWithId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_connectedById_fkey" FOREIGN KEY ("connectedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePermission" ADD CONSTRAINT "RecipePermission_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePermission" ADD CONSTRAINT "RecipePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "Temperature_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
