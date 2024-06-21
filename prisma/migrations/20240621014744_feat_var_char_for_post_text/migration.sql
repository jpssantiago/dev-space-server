/*
  Warnings:

  - You are about to alter the column `text` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2200)`.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "text" SET DATA TYPE VARCHAR(2200);
