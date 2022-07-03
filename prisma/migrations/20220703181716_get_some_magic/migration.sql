-- CreateTable
CREATE TABLE "AnsweredQuestion" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "answerId" INTEGER NOT NULL,
    "gameStateId" INTEGER NOT NULL,

    CONSTRAINT "AnsweredQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameState" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
