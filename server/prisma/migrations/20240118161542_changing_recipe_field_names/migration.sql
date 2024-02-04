/*
  Warnings:

  - You are about to drop the `Temperature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Temperature" DROP CONSTRAINT "Temperature_instructionId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_instructionId_fkey";

-- AlterTable
ALTER TABLE "Instruction" ADD COLUMN     "tempUnit" "TemperatureUnit" DEFAULT 'C',
ADD COLUMN     "temperature" INTEGER,
ADD COLUMN     "time" TIMESTAMP(3);

-- DropTable
DROP TABLE "Temperature";

-- DropTable
DROP TABLE "Time";
