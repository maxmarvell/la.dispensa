/*
  Warnings:

  - You are about to drop the column `permission` on the `RecipePermission` table. All the data in the column will be lost.
  - Added the required column `role` to the `RecipePermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipePermission" DROP COLUMN "permission",
ADD COLUMN     "role" "Role" NOT NULL;
