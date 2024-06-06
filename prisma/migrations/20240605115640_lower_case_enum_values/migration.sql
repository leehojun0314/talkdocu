/*
  Warnings:

  - The values [ASSISTANT,USER] on the enum `Sender` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATED,ANALYZING,ERROR] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Sender_new" AS ENUM ('assistant', 'user');
ALTER TABLE "Debate_Message" ALTER COLUMN "sender" TYPE "Sender_new" USING ("sender"::text::"Sender_new");
ALTER TYPE "Sender" RENAME TO "Sender_old";
ALTER TYPE "Sender_new" RENAME TO "Sender";
DROP TYPE "Sender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('created', 'analyzing', 'error');
ALTER TABLE "Conversation" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
