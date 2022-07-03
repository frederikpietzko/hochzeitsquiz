import { NextPage } from 'next';
import Head from 'next/head';
import { QuestionItem } from '../../components/QuestionItem';
import { trpc } from '../../utils/trpc';
import { FaSearch } from 'react-icons/fa';
import React from 'react';
import { Navigation } from '../../components/Navigation';

const QuestionList: NextPage = () => {
  const { data: questions } = trpc.useQuery(['allQuestions']);
  const [search, setSearch] = React.useState('');
  const filteredQuestions = React.useMemo(() => {
    return questions?.filter((q) =>
      q.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [questions, search]);
  return (
    <div className="px-2 pt-2">
      <Head>
        <title>Hochzeitsquiz | Alle Fragen</title>
      </Head>
      <Navigation />
      <h1 className="text-3xl mb-3">Alle Fragen</h1>
      <div className="relative">
        <input
          type="search"
          className="w-full mb-2"
          placeholder="Suchbegriff"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute top-3 right-2 z-10 text-lg" />
      </div>
      <div className="flex flex-col gap-2">
        {filteredQuestions?.map((question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
