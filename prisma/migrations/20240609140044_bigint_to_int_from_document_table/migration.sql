/*
  Warnings:

  - You are about to alter the column `document_size` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "document_size" SET DATA TYPE INTEGER;
