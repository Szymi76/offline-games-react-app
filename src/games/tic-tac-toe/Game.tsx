import { Mark, Tile as TileType, useGame } from "./context";

import BottomGameBar from "./components/BottomGameBar";
import { Button } from "@nextui-org/react";
import EndGameBar from "./components/EndGameBar";
import Tile from "./components/Tile";
import TopGameBar from "./components/TopGameBar";
import { useLocalStorage } from "react-use";

const Game = () => {
  const game = useGame();

  return (
    <div className="flex flex-col gap-5">
      <TopGameBar />
      <div className="grid grid-cols-3 grid-rows-3 gap-3">
        {mapJSX2DTilesArray(game.board, game.playerMark)}
      </div>
      <BottomGameBar />
      {game.state === "ended" && <EndGameBar />}
    </div>
  );
};

export default Game;

function mapJSX2DTilesArray(board: TileType[][], previewMark: Mark) {
  const boardLength = board.length;
  const elements = [];
  for (let i = 0; i < boardLength; i++) {
    for (let j = 0; j < boardLength; j++) {
      elements.push(
        <Tile
          key={`tile-${i}-${j}`}
          {...board[i][j]}
          previewMark={previewMark}
        />
      );
    }
  }
  return elements;
}
