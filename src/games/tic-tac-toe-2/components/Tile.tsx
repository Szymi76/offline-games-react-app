import { X, Circle, LucideProps } from "lucide-react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Tile as TileType } from "../types";
import { Button } from "@nextui-org/react";
import { useGame } from "../useGame";
import { useHoverDirty, useWindowSize } from "react-use";
import { useRef } from "react";

type TileProps = { tile: TileType };
const Tile = (props: TileProps) => {
  const tileRef = useRef<HTMLButtonElement>(null);
  const isHovering = useHoverDirty(tileRef);

  const { result, makeMove, side } = useGame();
  const isDisabled = result.gameState === "finished";
  const isPreview = isHovering && !props.tile.side;

  const motionProps: HTMLMotionProps<"div"> = {
    initial: { scale: 0.5 },
    animate: { scale: 1 },
    transition: { duration: 0.1 },
  };

  const handleMove = async () => {
    await makeMove({ ...props.tile, side: side.player }, side.player);
  };

  return (
    <div className="aspect-square flex-1 bg-background md:h-36 md:w-36">
      <Button
        ref={tileRef}
        className={`h-full w-full rounded-none bg-transparent md:h-36 md:w-36 ${props.tile.isWinningTile ? "disabled:opacity-hover" : "disabled:opacity-disabled"}`}
        isDisabled={isDisabled}
        onPress={handleMove}
        isIconOnly
        startContent={
          <motion.div
            key={String(props.tile.side || isPreview)}
            {...motionProps}
            className="relative flex items-center justify-center"
          >
            <SideIcon {...props.tile} isPreview={isPreview} />
          </motion.div>
        }
      ></Button>
    </div>
  );
};

export default Tile;

const SideIcon = (props: TileType & { isPreview: boolean }) => {
  const playerSide = useGame().side.player;
  const { width } = useWindowSize();

  if (!props.side && !props.isPreview) return <></>;

  const currentSide = props.side || playerSide;
  const textColor = getRandomTextColorClassName();
  const iconProps: LucideProps = {
    size: width < 768 ? 36 : 48,
    className: `absolute duration-100 scale-[3] ${
      props.isWinningTile ? `${textColor} animate-pulse` : "text-default-500"
    }`,
    strokeWidth: 1.5,
    opacity: props.isPreview ? 0.5 : 1,
  };

  return currentSide === "x" ? <X {...iconProps} /> : <Circle {...iconProps} />;
};

const getRandomTextColorClassName = () => {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
