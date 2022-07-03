import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <div className="text-lg underline flex gap-2">
      <Link href="/questions">Liste</Link>
      <Link href="/questions/create">Erstellen</Link>
    </div>
  );
};
