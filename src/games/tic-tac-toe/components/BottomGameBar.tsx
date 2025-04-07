import { GameState, useGame } from "../context";

const gameState = new Map<GameState, string>([
  ["waiting", "Czekanie"],
  ["started", "W trakcie gry"],
  ["ended", "Zakończono"],
]);

const BottomGameBar = () => {
  const game = useGame();

  return (
    <div className="bg-default-100 border-2 border-default-200 rounded-lg p-3 w-full flex items-center text-sm font-semibold">
      <div>
        Kolej:{" "}
        <span className="text-default-500">
          {game.turn === "x" ? "X" : "O"}
        </span>
      </div>
      <HorizontalDivider />
      <div>
        Liczba gier:{" "}
        <span className="text-default-500">{game.score?.played}</span>
      </div>
      <HorizontalDivider />
      <div>
        Wygrane: <span className="text-default-500">{game.score?.won}</span>
      </div>
    </div>
  );
};

export default BottomGameBar;

const HorizontalDivider = () => {
  return <span className="text-default-300 px-3"> | </span>;
};
