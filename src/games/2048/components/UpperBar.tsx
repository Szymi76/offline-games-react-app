import { useEffect, useState } from "react";
import useGame from "../useGame";
import { AnimatePresence, motion } from "framer-motion";

const UpperBar = () => {
  const { score, isGameEnded } = useGame();
  const [isNewRecord, setIsNewRecord] = useState<boolean | null>(null);

  useEffect(() => {
    if (isNewRecord === null) {
      setIsNewRecord(false);
      return;
    }

    setIsNewRecord(true);

    const handleTimeout = () => setIsNewRecord(false);
    const timeoutId = setTimeout(handleTimeout, 5000);

    return () => clearTimeout(timeoutId);
  }, [score.max]);

  return (
    <div className="relative flex items-center justify-end">
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-3">
          <p className="text-sm text-default-700">Najlepszy wynik:</p>
          <p className="font-bold">{score.max}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-default-700">Aktualny wynik:</p>
          <p className="font-bold">{score.current}</p>
        </div>
      </div>

      <AnimatePresence>
        {isNewRecord && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute -top-8 right-0 rounded-full bg-warning px-8 py-1 text-sm font-semibold text-default-800"
          >
            Nowy rekord!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGameEnded && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute left-0 rounded-full bg-secondary px-5 py-2 font-bold text-default-800"
          >
            Koniec rozgrywki
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpperBar;
