import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { questionsRouter } from '../../../server/questions';

export const appRouter = trpc
  .router()
  .merge(questionsRouter)
  .query('hello', {
    input: z.object({ text: z.string().nullish() }).nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
