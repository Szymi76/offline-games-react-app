import { useState } from "react";
import { useInterval } from "react-use";
import { useGame } from "../useGame";

const Timer = () => {
  const { isFirstClick, isWin, isGameOver } = useGame();
  const [seconds, setSeconds] = useState(0);

  useInterval(() => {
    if (!isFirstClick && !isWin) {
      setSeconds((seconds) => seconds + 1);
    } else if (!isGameOver) setSeconds(0);
  }, 1000);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <p className="text-xl font-bold tabular-nums">
      {minutes >= 10 ? minutes : "0" + minutes}:
      {remainingSeconds >= 10 ? remainingSeconds : "0" + remainingSeconds}
    </p>
  );
};

export default Timer;
