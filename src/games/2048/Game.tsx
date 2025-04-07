import "./styles.css";

import Tile from "./components/Tile";
import useGame from "./useGame";
import { useKey } from "react-use";
import UpperBar from "./components/UpperBar";
import BottomBar from "./components/BottomBar";
import { Finger } from "react-finger";
import { MoveDirection } from "./types";

const FingeredDiv = Finger("div");

const Game = () => {
  const { renderBoard, makeMove, isGameEnded } = useGame();

  const handleMove = (direction: MoveDirection) => {
    if (isGameEnded) return;
    makeMove(direction);
  };
  useKey("ArrowUp", () => handleMove("to-top"));
  useKey("ArrowDown", () => handleMove("to-bottom"));
  useKey("ArrowLeft", () => handleMove("to-left"));
  useKey("ArrowRight", () => handleMove("to-right"));

  return (
    <div className="flex flex-col gap-3">
      <UpperBar />
      <FingeredDiv
        onSwipeDown={() => handleMove("to-bottom")}
        onSwipeUp={() => handleMove("to-top")}
        onSwipeLeft={() => handleMove("to-left")}
        onSwipeRight={() => handleMove("to-right")}
        className={`grid grid-cols-4 grid-rows-4 gap-3 rounded-lg bg-default p-5 ${isGameEnded ? "opacity-50" : "opacity-100"}`}
      >
        {renderBoard.map((row, i) => {
          return row.map((tile, j) => {
            return (
              <div
                key={Math.random()}
                className="relative h-[74px] w-[74px] rounded-lg bg-default-400 md:h-[90px] md:w-[90px]"
              >
                <Tile {...tile} arrCords={{ x: i, y: j }} />
              </div>
            );
          });
        })}
      </FingeredDiv>
      <BottomBar />
    </div>
  );
};

export default Game;
