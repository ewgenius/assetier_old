import type { NextPageExtended } from "@assetier/types";
import Head from "next/head";
import Image from "next/image";

const Home: NextPageExtended = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Assetier</title>
      </Head>
      <main className="flex-grow flex flex-col items-center justify-center">
        <Image src="/logo-256x256.png" width="64" height="64" />
        <h1 className="mt-4 font-semibold text-4xl">Assetier</h1>
        <p className="text-gray-400 mt-2">coming soon...</p>
      </main>
    </div>
  );
};

Home.type = "site";
Home.navId = "none";

export default Home;
