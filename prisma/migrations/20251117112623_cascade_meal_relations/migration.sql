-- DropForeignKey
ALTER TABLE "public"."Macronutrients" DROP CONSTRAINT "Macronutrients_mealId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Micronutrients" DROP CONSTRAINT "Micronutrients_mealId_fkey";

-- AddForeignKey
ALTER TABLE "Macronutrients" ADD CONSTRAINT "Macronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micronutrients" ADD CONSTRAINT "Micronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
