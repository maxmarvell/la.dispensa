/*
  Warnings:

  - Made the column `temperature` on table `TimeAndTemperature` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TimeAndTemperature" ALTER COLUMN "temperature" SET NOT NULL;
