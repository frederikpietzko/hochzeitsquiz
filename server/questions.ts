import * as trpc from '@trpc/server';
import _ from 'lodash';
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
    async resolve() {
      const answeredQuestions = (
        await prisma.answeredQuestion.findMany({ select: { questionId: true } })
      ).map((q) => q.questionId);

      const questions = await prisma.question.findMany({
        select: { id: true, question: true, answers: true },
        where: {
          id: { notIn: answeredQuestions },
        },
      });
      const q = questions[Math.floor(Math.random() * questions.length)];
      if (!q) {
        return null;
      }
      q.answers = _.shuffle(q?.answers);
      return q;
    },
  })
  .mutation('answerQuestion', {
    input: z.object({
      questionId: z.number(),
      answerId: z.number(),
    }),
    async resolve({ input }) {
      const answer = await prisma.answer.findFirst({
        where: { id: input.answerId },
      });
      await prisma.answeredQuestion.create({
        data: {
          answerId: answer!.id,
          correct: answer!.correct,
          questionId: input.questionId,
        },
      });
    },
  })
  .mutation('resetQuestions', {
    async resolve() {
      await prisma.answeredQuestion.deleteMany();
    },
  })
  .query('correctQuestions', {
    async resolve() {
      return await prisma.answeredQuestion.count({ where: { correct: true } });
    },
  });
