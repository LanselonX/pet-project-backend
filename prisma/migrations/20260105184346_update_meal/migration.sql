/*
  Warnings:

  - Added the required column `price` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Macronutrients" DROP CONSTRAINT "Macronutrients_mealId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Micronutrients" DROP CONSTRAINT "Micronutrients_mealId_fkey";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Macronutrients" ADD CONSTRAINT "Macronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micronutrients" ADD CONSTRAINT "Micronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
