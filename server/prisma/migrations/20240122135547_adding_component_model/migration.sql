-- CreateTable
CREATE TABLE "Component" (
    "recipeId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("recipeId","componentId")
);

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
