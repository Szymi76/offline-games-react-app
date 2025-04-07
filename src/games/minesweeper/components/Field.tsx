import { Field as FieldType } from "../types";
import { useGame } from "../useGame";
import { AnimatePresence, MotionStyle, motion } from "framer-motion";
import { Bomb, FlagTriangleRight } from "lucide-react";

type FieldProps = FieldType;
const Field = (props: FieldProps) => {
  const { revealField, difficulty } = useGame();
  const delay = props.revealDaley ?? 0;
  const size = difficulty === "hard" ? 28 : 48;

  const style = { height: size, width: size, transformStyle: "preserve-3d" };

  return (
    <motion.div
      key={props.id}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: props.isReveled ? 180 : 0 }}
      transition={{
        delay: delay * 0.05,
        duration: 0.25,
      }}
      className="relative"
      style={style as MotionStyle}
      onClick={() => revealField(props.cords)}
    >
      <FrontField {...props} />
      <BackField {...props} />
    </motion.div>
  );
};

export default Field;

const BackField = (props: FieldType) => {
  const [x, y] = props.cords;
  const isEven = (x + y) % 2 !== 0;

  const delay = props.revealDaley ?? 0;
  const value = props.value === 0 ? "" : props.value;
  const defaultBg = isEven ? "bg-default-600" : "bg-default-700";
  const mineBg = isEven ? "bg-red-300" : "bg-red-400";

  return (
    <div
      className={`duration-50 absolute grid h-full w-full place-content-center text-xl font-extrabold text-default-100 ${props.isMine ? mineBg : defaultBg}`}
      style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
    >
      {props.isMine ? (
        <motion.span
          key={`${props.id}-${String(props.isReveled)}`}
          initial={{ opacity: 0, scale: 0.25, y: 200 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay * 0.1,
            type: "spring",
            stiffness: 50,
          }}
        >
          <Bomb fill="black" stroke="black" />
        </motion.span>
      ) : (
        value
      )}
    </div>
  );
};

const FrontField = (props: FieldType) => {
  const { toggleFlag, difficulty } = useGame();
  const [x, y] = props.cords;
  const isEven = (x + y) % 2 !== 0;

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    toggleFlag(props.cords);
  };

  return (
    <div
      className={`absolute grid h-full w-full place-content-center ${isEven ? "bg-blue-500" : "bg-blue-600"} cursor-pointer duration-150 hover:bg-blue-700`}
      style={{ backfaceVisibility: "hidden" }}
      onContextMenu={handleRightClick}
    >
      <AnimatePresence>
        {props.isFlagged ? (
          <motion.span
            initial={{ opacity: 0.5, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.05, type: "spring", stiffness: 150 }}
          >
            <FlagTriangleRight
              strokeWidth={3}
              size={difficulty === "hard" ? 18 : 26}
              fill="#fcd34d"
              stroke="#fcd34d"
            />
          </motion.span>
        ) : (
          ""
        )}
      </AnimatePresence>
    </div>
  );
};
