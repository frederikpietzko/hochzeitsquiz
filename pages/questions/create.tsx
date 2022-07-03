import { zodResolver } from '@hookform/resolvers/zod';
import { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';

interface QuestionData {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

const questionSchema = z.object({
  question: z.string().min(15),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
});

const CreateQuestion: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<QuestionData>({
    resolver: zodResolver(questionSchema),
  });
  const utils = trpc.useContext();
  const { mutate: createQuestion } = trpc.useMutation('createQuestion', {
    onSuccess(question) {
      utils.invalidateQueries(['allQuestions']);
      utils.invalidateQueries(['answersToQuestion', question.id]);
    },
  });
  const onSubmit = (data: QuestionData) => {
    createQuestion({
      question: data.question,
      answers: [data.answer1, data.answer2, data.answer3, data.answer4],
    });
    reset();
  };

  return (
    <>
      <Head>
        <title>Hochzeitsquiz | Neue Frage</title>
      </Head>
      <div className="px-2 pt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-2">
            <h1 className="text-3xl mb-5">Neue Frage erstellen</h1>
          </div>
          <div className="mb-3">
            <label htmlFor="question" className="block text-lg">
              Neue Frage:
            </label>
            <textarea
              id="question"
              placeholder="Was ist der Sinn des Lebens?"
              className="w-full"
              {...register('question')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="answer1" className="text-lg">
              Antwort 1:
            </label>
            <input
              id="answer1"
              type="text"
              placeholder="42"
              {...register('answer1')}
            />
            <label htmlFor="answer2" className="text-lg">
              Antwort 2:
            </label>
            <input
              id="answer1"
              type="text"
              placeholder="43"
              {...register('answer2')}
            />
            <label htmlFor="answer3" className="text-lg">
              Antwort 3:
            </label>
            <input
              id="answer3"
              type="text"
              placeholder="44"
              {...register('answer3')}
            />
            <label htmlFor="answer4" className="text-lg">
              Antwort 4:
            </label>
            <input
              id="answer4"
              type="text"
              placeholder="42"
              {...register('answer4')}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-fuchsia-600 rounded text-xl p-3 absolute bottom-0 right-0 left-0 z-10"
          >
            Frage hinzufügen
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateQuestion;
