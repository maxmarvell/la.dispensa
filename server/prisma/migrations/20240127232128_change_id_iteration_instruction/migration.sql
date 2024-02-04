/*
  Warnings:

  - The `unit` column on the `IngredientIteration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unit` column on the `RecipeIngredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IngredientUnit" AS ENUM ('G', 'KG', 'CUP', 'ML', 'L', 'OZ');

-- AlterTable
ALTER TABLE "IngredientIteration" DROP COLUMN "unit",
ADD COLUMN     "unit" "IngredientUnit";

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "unit",
ADD COLUMN     "unit" "IngredientUnit";

-- DropEnum
DROP TYPE "IngreidentUnit";
