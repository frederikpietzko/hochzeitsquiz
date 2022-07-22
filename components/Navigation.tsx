import Link from 'next/link';
import { trpc } from '../utils/trpc';

export const Navigation: React.FC = () => {
  const { mutate: resetQuestions } = trpc.useMutation('resetQuestions');
  return (
    <div className="text-lg underline flex gap-2">
      <Link href="/questions">Liste</Link>
      <Link href="/questions/create">Erstellen</Link>
      <button
        className="bg-red-500 px-2 py-1 rounded "
        onClick={() => resetQuestions()}
      >
        Reset
      </button>
    </div>
  );
};
