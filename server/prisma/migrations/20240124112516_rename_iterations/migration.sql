/*
  Warnings:

  - You are about to drop the `RecipeIteration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientIteration" DROP CONSTRAINT "IngredientIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "InstructionIteration" DROP CONSTRAINT "InstructionIteration_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIteration" DROP CONSTRAINT "RecipeIteration_parentId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIteration" DROP CONSTRAINT "RecipeIteration_recipeId_fkey";

-- DropTable
DROP TABLE "RecipeIteration";

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

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientIteration" ADD CONSTRAINT "IngredientIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionIteration" ADD CONSTRAINT "InstructionIteration_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
