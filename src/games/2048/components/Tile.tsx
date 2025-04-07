import { useWindowSize } from "react-use";
import { Cords, RenderTile } from "../types";

import { getBGClassName } from "../utils";
import { motion } from "framer-motion";

const Tile = (props: RenderTile & { arrCords: Cords }) => {
  if (props.value === 0) {
    return <div className="z-10 h-full w-full rounded-lg"></div>;
  }

  const cords = props.arrCords;

  return (
    <div className="relative z-10 h-full w-full rounded-lg">
      {props.isMerged && (
        <div className="absolute left-0 top-0 z-0 h-full w-full">
          <TransitionTile
            from={props.isMerged}
            to={cords}
            value={props.value / 2}
          />
        </div>
      )}
      <div className="absolute left-0 top-0 h-full w-full">
        <TransitionTile
          from={props.from}
          to={cords}
          value={props.value}
          isNew={props.isNew}
          isMerge={!!props.isMerged}
        />
      </div>
    </div>
  );
};

export default Tile;

type TransitionTileProps = {
  from: Cords | null | undefined;
  to: Cords;
  value: number;
  isNew?: boolean;
  isMerge?: boolean;
};
const TransitionTile = (props: TransitionTileProps) => {
  const { width } = useWindowSize();
  const boxSize = width > 768 ? 90 : 74;

  const initial = props.from
    ? createTranslation(props.from, props.to, boxSize, 12)
    : {};

  const bg = getBGClassName(props.value);

  const isCustomScale = props.isMerge || props.isNew;
  const customScale = props.isNew ? 0 : 1.25;

  return (
    <motion.div
      initial={{ ...initial, scale: isCustomScale ? customScale : 1 }}
      animate={{ x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 0.1,
        delay: props.isNew ? 0.15 : 0,
        type: "spring",
        mass: 0.2,
      }}
      className={`grid h-full w-full place-content-center rounded-lg ${bg} absolute text-4xl font-extrabold`}
    >
      {props.value}
    </motion.div>
  );
};

function createTranslation(
  from: Cords | null | undefined,
  to: Cords,
  boxSize: number,
  gap: number,
) {
  if (!from) return {};

  let xDiff = from.x - to.x;
  let yDiff = from.y - to.y;

  const x = xDiff * (boxSize + gap);
  const y = yDiff * (boxSize + gap);

  return { x: y, y: x };
}
