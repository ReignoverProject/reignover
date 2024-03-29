
import { type NextPage } from "next";
import { StartGame } from "../components/startGame";
import { TestStuff } from "../components/testingstuff";
import useRefresh from "../utils/useRefresh";

const Home: NextPage = () => {

  return (
    <div className="flex-col flex items-center">
      <div>
        <p>Hello</p> 
      </div>
      <div className="justify-center content-center items-center">
        <StartGame />
        {/* <TestStuff /> */}
      </div>
    </div>
  );
};

export default Home;
