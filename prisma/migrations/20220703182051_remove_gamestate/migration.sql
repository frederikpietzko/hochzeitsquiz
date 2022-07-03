/*
  Warnings:

  - You are about to drop the column `gameStateId` on the `AnsweredQuestion` table. All the data in the column will be lost.
  - You are about to drop the `GameState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnsweredQuestion" DROP CONSTRAINT "AnsweredQuestion_gameStateId_fkey";

-- AlterTable
ALTER TABLE "AnsweredQuestion" DROP COLUMN "gameStateId";

-- DropTable
DROP TABLE "GameState";
