/*
  Warnings:

  - You are about to drop the `Iteration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientIteration" DROP CONSTRAINT "IngredientIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "InstructionIteration" DROP CONSTRAINT "InstructionIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Iteration" DROP CONSTRAINT "Iteration_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Iteration" DROP CONSTRAINT "Iteration_recipeId_fkey";

-- DropTable
DROP TABLE "Iteration";

-- CreateTable
CREATE TABLE "RecipeIteration" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "parentId" TEXT,
    "description" VARCHAR(255),

    CONSTRAINT "RecipeIteration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIteration" ADD CONSTRAINT "RecipeIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIteration" ADD CONSTRAINT "RecipeIteration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "RecipeIteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientIteration" ADD CONSTRAINT "IngredientIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "RecipeIteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionIteration" ADD CONSTRAINT "InstructionIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "RecipeIteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
