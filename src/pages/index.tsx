import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Head>
        <title>Assetier | App</title>
      </Head>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="font-semibold text-4xl">📦 app</h1>
        <p className="text-gray-400 mt-2">coming soon...</p>
      </main>
      <footer className="flex flex-col items-center p-2 text-gray-400 text-sm">
        <p>&copy; 2021 assetier.app</p>
      </footer>
    </div>
  );
};

export default Home;
