import Game from "./Game";
import GameLayout from "../GameLayout";
import { GameProvider } from "./context";

const TicTacToe = () => {
  return (
    <GameProvider>
      <GameLayout>
        <Game />
      </GameLayout>
    </GameProvider>
  );
};

export default TicTacToe;
