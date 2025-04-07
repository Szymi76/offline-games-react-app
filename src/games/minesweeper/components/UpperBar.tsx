import { Tooltip } from "@nextui-org/react";
import { useGame } from "../useGame";
import { AnimatePresence, motion } from "framer-motion";
import { Bomb, FlagTriangleRight } from "lucide-react";
import Timer from "./Timer";

const UpperBar = () => {
  const { minesCount, flagsLeft, isGameOver, isWin } = useGame();

  return (
    <div className="relative flex items-center justify-end">
      <div className="flex items-end gap-8">
        <Timer />
        <div className="flex flex-col items-end">
          <Tooltip content="Liczba min" placement="left">
            <div className="flex items-center gap-3">
              <Bomb size={18} fill="white" />
              <p className="font-bold tabular-nums">{minesCount}</p>
            </div>
          </Tooltip>
          <Tooltip content="Liczba pozostałych flag" placement="left">
            <div className="flex items-center gap-3 tabular-nums">
              <FlagTriangleRight size={18} fill="white" />
              <p className="font-bold">
                {flagsLeft < 10 ? "0" + flagsLeft : flagsLeft}
              </p>
            </div>
          </Tooltip>
        </div>
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`absolute left-0 rounded-full ${isWin ? "bg-success" : "bg-secondary"} px-5 py-2 font-bold text-slate-100`}
          >
            {isWin ? "Zwycięstwo" : "Koniec rozgrywki"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpperBar;
