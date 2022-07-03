import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
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
