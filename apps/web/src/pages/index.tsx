import type { NextPageExtended } from "@assetier/types";
import Head from "next/head";
import Image from "next/image";

const Home: NextPageExtended = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Assetier</title>
      </Head>
      <main className="flex flex-grow flex-col items-center justify-center">
        <Image src="/logo-256x256.png" width="64" height="64" />
        <h1 className="mt-4 text-4xl font-semibold">Assetier</h1>
        <p className="mt-2 text-gray-400">coming soon...</p>
      </main>
    </div>
  );
};

Home.type = "site";
Home.navId = "none";

export default Home;
