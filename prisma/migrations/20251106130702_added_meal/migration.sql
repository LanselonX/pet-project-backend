-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('VEGETARIAN', 'NOT_SPICY', 'LOW_CARB', 'GLUTEN_FREE');

-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "type" "MealType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Macronutrients" (
    "id" SERIAL NOT NULL,
    "calories" TEXT NOT NULL,
    "fat" TEXT NOT NULL,
    "carbs" TEXT NOT NULL,
    "protein" TEXT NOT NULL,
    "fiber" TEXT NOT NULL,
    "sugars" TEXT NOT NULL,
    "mealId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Macronutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Micronutrients" (
    "id" SERIAL NOT NULL,
    "omega" TEXT NOT NULL,
    "magnesium" TEXT NOT NULL,
    "vitaminB" TEXT NOT NULL,
    "vitaminD" TEXT NOT NULL,
    "calcium" TEXT NOT NULL,
    "iron" TEXT NOT NULL,
    "potassium" TEXT NOT NULL,
    "sodium" TEXT NOT NULL,
    "mealId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Micronutrients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Macronutrients_mealId_key" ON "Macronutrients"("mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Micronutrients_mealId_key" ON "Micronutrients"("mealId");

-- AddForeignKey
ALTER TABLE "Macronutrients" ADD CONSTRAINT "Macronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Micronutrients" ADD CONSTRAINT "Micronutrients_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
