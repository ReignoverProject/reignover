
import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { Web3ContextProvider } from "../utils/context";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>  
      );
};

export default MyApp;
