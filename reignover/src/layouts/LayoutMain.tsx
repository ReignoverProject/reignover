import Head from "next/head"
import { NavBar } from "../components/navBar"


export const LayoutMain: React.FC<{children: React.ReactNode}> = ({children}) => {
    
    return (
    <>
        <Head>
            <title>Reignover</title>
            <meta name="description" content="City-building strategy game" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col bg-gradient-to-t from-[#3e3e3e] to-[#1a1a1a] p-2 relative">
            <NavBar />
            {children}
        </main>
    </>
    )
}