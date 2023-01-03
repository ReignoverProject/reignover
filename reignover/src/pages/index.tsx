import { ConnectKitButton } from "connectkit";
import { type NextPage } from "next";
import Head from "next/head";
import { AdminView } from "../components/adminView";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Reignover</title>
        <meta name="description" content="City-building strategy game" />
        <link rel="icon" href="/favicon.ico" />
          </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-2">
        <div className="flex flex-row justify-end mb-2">
          <div className=""><ConnectKitButton /></div>
        </div>
        <AdminView />
      </main>
    </>
  );
};

export default Home;
