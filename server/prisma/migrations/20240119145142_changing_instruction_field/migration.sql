/*
  Warnings:

  - The `unit` column on the `Temperature` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Temperature" DROP COLUMN "unit",
ADD COLUMN     "unit" "TemperatureUnit" DEFAULT 'C';
