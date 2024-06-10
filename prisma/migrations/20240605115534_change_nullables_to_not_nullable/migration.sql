/*
  Warnings:

  - You are about to drop the column `end_time` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `document_url` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `message_order` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Paragraph` table. All the data in the column will be lost.
  - You are about to drop the column `last_conv` on the `UserTable` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_name` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salutation` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `visibility` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `question_id` on table `Debate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `answer_id` on table `Debate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refer_content` on table `Debate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Debate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Debate` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `sender` to the `Debate_Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `time` on table `Debate_Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `debate_id` on table `Debate_Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Debate_Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Debate_Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `document_size` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_time` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sender` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversation_id` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paragraph_content` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_number` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.
  - Made the column `document_id` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_name` on table `UserTable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_email` on table `UserTable` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'ANALYZING', 'ERROR');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('ASSISTANT', 'USER');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_question_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate_Message" DROP CONSTRAINT "Debate_Message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate_Message" DROP CONSTRAINT "Debate_Message_debate_id_fkey";

-- DropForeignKey
ALTER TABLE "Debate_Message" DROP CONSTRAINT "Debate_Message_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_document_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_conversation_id_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "end_time",
DROP COLUMN "fileUrl",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "conversation_name" SET NOT NULL,
ALTER COLUMN "salutation" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
ALTER COLUMN "visibility" SET NOT NULL,
ALTER COLUMN "conversation_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Debate" ALTER COLUMN "question_id" SET NOT NULL,
ALTER COLUMN "answer_id" SET NOT NULL,
ALTER COLUMN "refer_content" SET NOT NULL,
ALTER COLUMN "conversation_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Debate_Message" DROP COLUMN "sender",
ADD COLUMN     "sender" "Sender" NOT NULL,
ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "debate_id" SET NOT NULL,
ALTER COLUMN "conversation_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "document_url",
ALTER COLUMN "conversation_id" SET NOT NULL,
ALTER COLUMN "document_size" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "message_order",
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "created_time" SET NOT NULL,
ALTER COLUMN "conversation_id" SET NOT NULL,
ALTER COLUMN "sender" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "summary",
ALTER COLUMN "conversation_id" SET NOT NULL,
ALTER COLUMN "paragraph_content" SET NOT NULL,
ALTER COLUMN "order_number" SET NOT NULL,
ALTER COLUMN "document_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserTable" DROP COLUMN "last_conv",
ALTER COLUMN "user_name" SET NOT NULL,
ALTER COLUMN "user_email" SET NOT NULL;

-- DropTable
DROP TABLE "Question";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Message"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Message"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_debate_id_fkey" FOREIGN KEY ("debate_id") REFERENCES "Debate"("debate_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("document_id") ON DELETE RESTRICT ON UPDATE CASCADE;
