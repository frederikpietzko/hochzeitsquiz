import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { trpc } from '../utils/trpc';

interface QuestionItemProps {
  question: { id: number; question: string; answers: { answer: string }[] };
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const utils = trpc.useContext();
  const { mutate: deleteQuestion } = trpc.useMutation('deleteQuestion', {
    onSuccess() {
      utils.invalidateQueries('allQuestions');
    },
  });
  const onDelete = () => {
    if (confirm(`Soll die Frage:\n${question}\nwirklich gelöscht werden?`)) {
      deleteQuestion(question.id);
    }
  };
  return (
    <div className="rounded bg-fuchsia-500 text-white text-lg py-1 px-2 ">
      <div className="flex flex-row justify-between items-center">
        <div>{question.question}</div>
        <FaTrash onClick={onDelete} />
      </div>
      <div>
        {question.answers?.map(({ answer }, index) => (
          <div key={answer}>{`${index + 1} ${answer}`}</div>
        ))}
      </div>
    </div>
  );
};
