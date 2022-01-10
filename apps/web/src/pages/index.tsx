import type { NextPageExtended } from "lib-types";
import Head from "next/head";

const Home: NextPageExtended = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Assetier</title>
      </Head>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="font-semibold text-4xl">📦 Assetier</h1>
        <p className="text-gray-400 mt-2">coming soon...</p>
      </main>
    </div>
  );
};

Home.type = "site";
Home.navId = "none";

export default Home;
