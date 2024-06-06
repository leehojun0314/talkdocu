-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "user_id" INTEGER,
    "conversation_name" TEXT,
    "salutation" TEXT,
    "fileUrl" TEXT,
    "status" VARCHAR(50),
    "visibility" BOOLEAN,
    "conversation_id" VARCHAR(255),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debate" (
    "debate_id" SERIAL NOT NULL,
    "question_id" INTEGER,
    "answer_id" INTEGER,
    "refer_content" TEXT,
    "conversation_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "Debate_pkey" PRIMARY KEY ("debate_id")
);

-- CreateTable
CREATE TABLE "Debate_Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "sender" VARCHAR(255),
    "time" TIMESTAMP(3),
    "debate_id" INTEGER,
    "conversation_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "Debate_Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "document_id" SERIAL NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "document_url" VARCHAR(255),
    "conversation_id" INTEGER,
    "document_size" BIGINT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "message" TEXT,
    "created_time" TIMESTAMP(3),
    "conversation_id" INTEGER,
    "sender" VARCHAR(10),
    "message_order" INTEGER,
    "user_id" INTEGER,
    "is_question" BOOLEAN NOT NULL,
    "question_doc_name" VARCHAR(50),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "Paragraph" (
    "paragraph_id" SERIAL NOT NULL,
    "conversation_id" INTEGER,
    "paragraph_content" TEXT,
    "order_number" INTEGER,
    "summary" TEXT,
    "document_id" INTEGER,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("paragraph_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" SERIAL NOT NULL,
    "question_content" TEXT,
    "question_order" INTEGER,
    "conversation_id" INTEGER,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "UserTable" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(50),
    "user_email" TEXT,
    "last_conv" INTEGER,
    "profile_img" TEXT,
    "auth_type" VARCHAR(50),
    "auth_id" VARCHAR(200),
    "last_login" TIMESTAMP(3),

    CONSTRAINT "UserTable_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Message"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Message"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_debate_id_fkey" FOREIGN KEY ("debate_id") REFERENCES "Debate"("debate_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debate_Message" ADD CONSTRAINT "Debate_Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserTable"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
