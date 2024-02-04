/*
  Warnings:

  - The primary key for the `Temperature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Temperature` table. All the data in the column will be lost.
  - The primary key for the `Time` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Time` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Temperature" DROP CONSTRAINT "Temperature_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Time" DROP CONSTRAINT "Time_pkey",
DROP COLUMN "id";
