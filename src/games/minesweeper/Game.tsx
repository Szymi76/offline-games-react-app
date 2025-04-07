import Board from "./components/Board";
import BottomBar from "./components/BottomBar";
import UpperBar from "./components/UpperBar";

const Game = () => {
  return (
    <div className="flex flex-col gap-5">
      <UpperBar />
      <Board />
      <BottomBar />
    </div>
  );
};

export default Game;
