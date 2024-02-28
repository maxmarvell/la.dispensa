-- CreateTable
CREATE TABLE "RootLayout" (
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "recipeId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NodeLayout" (
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "recipeId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RootLayout_recipeId_key" ON "RootLayout"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "NodeLayout_recipeId_key" ON "NodeLayout"("recipeId");

-- AddForeignKey
ALTER TABLE "RootLayout" ADD CONSTRAINT "RootLayout_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeLayout" ADD CONSTRAINT "NodeLayout_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
