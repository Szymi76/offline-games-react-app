import { useWindowSize } from "react-use";
import { Board as BoardType } from "../types";
import { useGame } from "../useGame";
import Tile from "./Tile";

type MappedTilesBoardProps = { board: BoardType };
const Board = (props: MappedTilesBoardProps) => {
  const { startNewGame, result } = useGame();
  const { width } = useWindowSize();

  const handleStartNewGameOnBoardClick = () => {
    if (result.gameState === "finished" && width > 768) startNewGame();
  };

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-1 bg-default-800"
      onClick={handleStartNewGameOnBoardClick}
    >
      {props.board.flat().map((tile, index) => {
        return <Tile key={index} tile={tile} />;
      })}
    </div>
  );
};

export default Board;
