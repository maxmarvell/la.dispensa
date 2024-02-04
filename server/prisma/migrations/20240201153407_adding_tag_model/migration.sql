-- CreateTable
CREATE TABLE "Tag" (
    "recipeId" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_recipeId_name_key" ON "Tag"("recipeId", "name");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
