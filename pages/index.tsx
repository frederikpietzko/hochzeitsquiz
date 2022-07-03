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
    <>
      <Head>
        <title>Hochzeitsquiz</title>
      </Head>

      <div className="w-4/6 h-screen flex flex-col justify-center items-center m-auto">
        <div
          className="-mt-44 mb-28 rounded bg-rose-700 text-white w-full h-72 text-center flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setVisible(visible === 'show' ? 'hide' : 'show')}
        >
          <h3 className="text-3xl block ">
            Punktzahl: {correctQuestions ?? 0}
          </h3>

          <h1 className="text-6xl">
            {['show', 'answer'].includes(visible)
              ? question?.question
              : 'Was verbindet die Stehenden?'}
          </h1>
        </div>
        <div className="h-16 grid grid-cols-2  place-items-center">
          {question?.answers.map((a) => (
            <div
              key={a.id}
              className={`w-96 text-center text-3xl rounded  ${
                visible === 'answer' && a.correct
                  ? 'bg-lime-600'
                  : selected !== a.id
                  ? 'bg-rose-700'
                  : 'bg-yellow-700'
              } text-white mx-16 my-6 py-8 cursor-pointer`}
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
    </>
  );
};

export default Home;
