
import { type NextPage } from "next";
import { StartGame } from "../components/startGame";

const Home: NextPage = () => {
  return (
    <div className="flex-col flex items-center">
      <div>
        <p>Hello</p> 
      </div>
      <div className="justify-center content-center items-center">
        <StartGame />
      </div>
    </div>
  );
};

export default Home;
