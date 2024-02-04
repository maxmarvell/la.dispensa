/*
  Warnings:

  - The values [AUTHOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('VIEWER', 'CONTRIBUTOR', 'EDITOR');
ALTER TABLE "RecipePermission" ALTER COLUMN "permission" TYPE "Role_new" USING ("permission"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- CreateTable
CREATE TABLE "Iteration" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "parentId" TEXT,
    "description" VARCHAR(255),

    CONSTRAINT "Iteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientIteration" (
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" "IngreidentUnit",

    CONSTRAINT "IngredientIteration_pkey" PRIMARY KEY ("recipeId","ingredientId")
);

-- CreateTable
CREATE TABLE "InstructionIteration" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "recipeId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,

    CONSTRAINT "InstructionIteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeIteration" (
    "instructionId" TEXT NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER
);

-- CreateTable
CREATE TABLE "TemperatureIteration" (
    "instructionId" TEXT NOT NULL,
    "temperature" INTEGER,
    "unit" "TemperatureUnit" DEFAULT 'C'
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeIteration_instructionId_key" ON "TimeIteration"("instructionId");

-- CreateIndex
CREATE UNIQUE INDEX "TemperatureIteration_instructionId_key" ON "TemperatureIteration"("instructionId");

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientIteration" ADD CONSTRAINT "IngredientIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientIteration" ADD CONSTRAINT "IngredientIteration_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionIteration" ADD CONSTRAINT "InstructionIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeIteration" ADD CONSTRAINT "TimeIteration_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "InstructionIteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemperatureIteration" ADD CONSTRAINT "TemperatureIteration_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "InstructionIteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
