import _ from 'lodash';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const { data: question } = trpc.useQuery(['nextQuestion'], {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const { data: correctQuestions } = trpc.useQuery(['correctQuestions']);
  const { mutateAsync: answerQuestion } = trpc.useMutation('answerQuestion', {
    onSuccess() {
      utils.invalidateQueries(['correctQuestions']);
    },
  });
  const { mutateAsync: resetQuestions } = trpc.useMutation('resetQuestions', {
    onSuccess() {
      utils.invalidateQueries(['nextQuestion']);
      utils.invalidateQueries(['correctQuestions']);
      setSelected(undefined);
      setVisible('hide');
    },
  });
  const [visible, setVisible] = React.useState<'show' | 'hide' | 'answer'>(
    'hide'
  );
  const [selected, setSelected] = React.useState<number>();
  const handleClick = (answerId: number) => {
    if (answerId !== selected) {
      setSelected(answerId);
    } else {
      if (visible === 'answer') {
        return utils.invalidateQueries(['nextQuestion']);
      }
      answerQuestion({ answerId, questionId: question!.id }).then(() =>
        setVisible('answer')
      );
    }
  };

  return (
    <div className='px-2'>
      <Head>
        <title>Hochzeitsquiz</title>
      </Head>
      <div className="flex flex-col justify-center items-center">
        <div
          className="my-3 rounded bg-rose-700 text-white text-center flex flex-col items-center justify-center cursor-pointer m-auto"
          onClick={() => setVisible(visible === 'show' ? 'hide' : 'show')}
        >
          <h3 className="text-3xl">
            Punktzahl: {correctQuestions ?? 0}
          </h3>

          <h1 className="text-6xl">
            {['show', 'answer'].includes(visible)
              ? question?.question
              : 'Was verbindet die Stehenden?'}
          </h1>
        </div>
        <div className="w-full grid grid-cols-1 mt-5 place-items-center gap-5">
          {question?.answers.map((a) => (
            <div
              key={a.id}
              className={`w-full text-center text-3xl rounded  ${
                visible === 'answer' && a.correct
                  ? 'bg-lime-600'
                  : selected !== a.id
                  ? 'bg-rose-700'
                  : 'bg-yellow-700'
              } text-white py-5 cursor-pointer`}
              onClick={() => handleClick(a.id)}
            >
              {a.answer}
            </div>
          ))}
        </div>
        {!question && (
          <button
            onClick={() => resetQuestions()}
            className="text-xl rounded bg-rose-700 px-2 py-1 text-white"
          >
            Spiel zurücksetzen
          </button>
        )}
      </div>
      </div>
  );
};

export default Home;
