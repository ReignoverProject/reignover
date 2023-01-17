
import { type AppType } from "next/dist/shared/lib/utils";
import { LayoutMain } from "../layouts/LayoutMain";
import "../styles/globals.css";
import { RefreshContextProvider, Web3ContextProvider } from "../utils/context";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Web3ContextProvider>
      <RefreshContextProvider>
        <LayoutMain>
          <Component {...pageProps} />
        </LayoutMain>
      </RefreshContextProvider>
    </Web3ContextProvider>  
      );
};

export default MyApp;
