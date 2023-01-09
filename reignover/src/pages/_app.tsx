
import { type AppType } from "next/dist/shared/lib/utils";
import { LayoutMain } from "../layouts/LayoutMain";
import "../styles/globals.css";
import { Web3ContextProvider } from "../utils/context";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Web3ContextProvider>
      <LayoutMain>
        <Component {...pageProps} />
      </LayoutMain>
    </Web3ContextProvider>  
      );
};

export default MyApp;
