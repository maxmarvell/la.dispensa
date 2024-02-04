/*
  Warnings:

  - You are about to drop the `RecipePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipePermission" DROP CONSTRAINT "RecipePermission_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipePermission" DROP CONSTRAINT "RecipePermission_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "public" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "RecipePermission";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "RecipeEditors" (
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecipeEditors_pkey" PRIMARY KEY ("recipeId","userId")
);

-- AddForeignKey
ALTER TABLE "RecipeEditors" ADD CONSTRAINT "RecipeEditors_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeEditors" ADD CONSTRAINT "RecipeEditors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
