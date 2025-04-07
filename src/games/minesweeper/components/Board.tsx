import { useGame } from "../useGame";
import Field from "./Field";

const Board = () => {
  const { board, isGameOver, restartGame } = useGame();

  const handleBoardClick = () => {
    if (isGameOver) restartGame();
  };

  return (
    <div
      className={`grid grid-cols-1 overflow-hidden rounded-lg ${isGameOver ? "opacity-50" : "opacity-100"}`}
      style={{ perspective: 800, ...getClassNameFromBoardSize(board.length) }}
      onClick={handleBoardClick}
    >
      {board.flat().map((field) => {
        return <Field key={field.id} {...field} />;
      })}
    </div>
  );
};

export default Board;

const getClassNameFromBoardSize = (size: number) => {
  const style = `repeat(${size}, minmax(0, 1fr))`;
  return { gridTemplateColumns: style, gridTemplateRows: style };
};
