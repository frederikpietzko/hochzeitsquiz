import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data } = trpc.useQuery(['hello', { text: 'Mama' }]);
  return (
    <div>
      <p>{data?.greeting}</p>
    </div>
  );
};

export default Home;
