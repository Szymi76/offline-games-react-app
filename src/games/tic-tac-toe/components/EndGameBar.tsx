import { useGame } from "../context";

const EndGameBar = () => {
  const { isEnded, playerMark } = useGame();

  if (isEnded.value) {
    if (isEnded.whoWon === playerMark) return <WinningBar />;
    else return <LosingBar />;
  }

  return <DrawBar />;
};

export default EndGameBar;

const WinningBar = () => {
  return (
    <div className="bg-green-600 border-2 border-green-400 rounded-lg p-2 w-full flex justify-center">
      WYGRYWASZ 🎉
    </div>
  );
};

const LosingBar = () => {
  return (
    <div className="bg-red-600 border-2 border-red-400 rounded-lg p-2 w-full flex justify-center">
      PRZEGRYWASZ 😔
    </div>
  );
};
const DrawBar = () => {
  return (
    <div className="bg-blue-600 border-2 border-blue-400 rounded-lg p-2 w-full flex justify-center">
      REMIS
    </div>
  );
};
