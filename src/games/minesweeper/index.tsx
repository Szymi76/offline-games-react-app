import { DifficultyHandler } from "./useGame";
import Game from "./Game";
import GameLayout from "../GameLayout";

const Minesweeper = () => {
  return (
    <GameLayout>
      <DifficultyHandler>
        <Game />
      </DifficultyHandler>
    </GameLayout>
  );
};

export default Minesweeper;
