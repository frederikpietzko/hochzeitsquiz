import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../db';

export const questionsRouter = trpc
  .router()
  .mutation('createQuestion', {
    input: z.object({ question: z.string(), answers: z.array(z.string()) }),
    async resolve({ input }) {
      const question = await prisma.question.create({
        data: { question: input.question },
      });
      const answers = input.answers.map((answer, index) => ({
        answer,
        questionId: question.id,
        correct: index === 0,
      }));
      await prisma.answer.createMany({ data: answers });
      return question;
    },
  })
  .mutation('editQuestion', {
    input: z.object({
      questionId: z.number(),
      question: z.string(),
      answers: z.array(z.string()),
    }),
    async resolve({ input }) {
      await prisma.answer.deleteMany({
        where: { questionId: input.questionId },
      });
      await prisma.question.update({
        data: { question: input.question },
        where: { id: input.questionId },
      });
      const answers = input.answers.map((answer) => ({
        answer,
        questionId: input.questionId,
      }));
      await prisma.answer.createMany({ data: answers });
    },
  })
  .mutation('deleteQuestion', {
    input: z.number(),
    async resolve({ input }) {
      await prisma.question.delete({ where: { id: input } });
    },
  })
  .query('allQuestions', {
    input: z.void(),
    async resolve({}) {
      return await prisma.question.findMany({
        select: {
          id: true,
          question: true,
          answers: { select: { answer: true } },
        },
      });
    },
  })
  .query('answersToQuestion', {
    input: z.number(),
    async resolve({ input }) {
      return await prisma.question
        .findFirst({ where: { id: input } })
        .answers();
    },
  })
  .query('nextQuestion', {
    input: z.void(),
    async resolve() {
      const answeredQuestions = (
        await prisma.answeredQuestion.findMany({ select: { id: true } })
      ).map((q) => q.id);

      const questions = await prisma.question.findMany({
        select: { id: true, question: true, answers: true },
        where: {
          id: { notIn: answeredQuestions },
        },
      });

      return questions[Math.floor(Math.random() * questions.length)];
    },
  })
  .mutation('answerQuestion', {
    input: z.object({
      questionId: z.number(),
      answer: z.number(),
    }),
    async resolve({ input }) {},
  });
