/*
  Warnings:

  - You are about to drop the column `created_at` on the `post` table. All the data in the column will be lost.
  - Added the required column `posted_at` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `created_at`,
    ADD COLUMN `posted_at` DATETIME(3) NOT NULL;
