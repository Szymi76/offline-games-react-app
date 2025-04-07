import GameLayout from "../GameLayout";
import Board from "./components/Board";
import BottomBar from "./components/BottomBar";
import UpperBar from "./components/UpperBar";
import { AIHandler, useGame } from "./useGame";

const Game = () => {
  const board = useGame().board;

  return (
    <AIHandler>
      <GameLayout>
        <div className="flex flex-col gap-5">
          <UpperBar />
          <Board board={board} />
          <BottomBar />
        </div>
      </GameLayout>
    </AIHandler>
  );
};

export default Game;
