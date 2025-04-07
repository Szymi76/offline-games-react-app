import { Tooltip } from "@nextui-org/react";
import { GameState, useGame } from "../useGame";
import { AnimatePresence, motion } from "framer-motion";

const UpperBar = () => {
  const { score, turn, side, result } = useGame();
  const isOngoing = result.gameState === "ongoing";

  const resultData = getDataFromGameResult(result, side);

  return (
    <div className="relative flex w-full items-center justify-around">
      <TurnText
        text="Ty"
        highlightText={turn === side.player && isOngoing}
        turn="player"
      />
      <div className="z-10 rounded-full bg-default-800 px-7 py-1 text-center font-bold tracking-widest text-background">
        {score.player} - {score.ai}
      </div>
      <TurnText
        text="AI"
        highlightText={turn === side.ai && isOngoing}
        turn="ai"
      />
      <AnimatePresence>
        {result.gameState === "finished" && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className={`absolute -top-10 rounded-full ${resultData.bg} px-5 py-1 font-semibold`}
          >
            {resultData.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpperBar;

type TurnTextProps = {
  text: string;
  highlightText: boolean;
  turn: "player" | "ai";
};
const TurnText = (props: TurnTextProps) => {
  const changeSide = useGame().changeSide;

  const tooltipContent =
    props.turn === "player"
      ? "Kliknij abyś ty zaczynał"
      : "Kliknij aby AI zaczynał";

  return (
    <Tooltip content={tooltipContent}>
      <p
        className={`cursor-pointer text-lg font-semibold duration-75 hover:scale-105 hover:text-primary ${
          props.highlightText
            ? "animate-pulse text-secondary"
            : "text-default-800"
        }`}
        onClick={() => changeSide(props.turn === "player" ? "x" : "o")}
      >
        {props.text}
      </p>
    </Tooltip>
  );
};

const getDataFromGameResult = (
  result: GameState["result"],
  side: GameState["side"],
) => {
  if (result.isDraw) return { bg: "bg-primary", text: "Remis" };
  if (result.IsWin && result.winner === side.player)
    return { bg: "bg-success", text: "Wygrywasz" };
  return { bg: "bg-danger", text: "Przegrywasz" };
};
