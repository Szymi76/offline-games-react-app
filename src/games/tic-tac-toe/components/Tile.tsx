import { Circle, X } from "lucide-react";
import {
  CrossDirection,
  EMPTY,
  Mark,
  Tile as TileType,
  useGame,
} from "../context";

import { Button } from "@nextui-org/react";
import { useHoverDirty } from "react-use";
import { useRef } from "react";

const ICON_SIZE = 64;

type TileProps = TileType & { previewMark: Mark };
const Tile = (props: TileProps) => {
  const { makeMove, state } = useGame();
  const ref = useRef<HTMLButtonElement>(null);
  const isHovering = useHoverDirty(ref);

  const Icon =
    props.mark === "x" ? <X size={ICON_SIZE} /> : <Circle size={ICON_SIZE} />;
  const PreviewIcon =
    props.previewMark === "x" ? (
      <X size={ICON_SIZE} className="text-gray-400" />
    ) : (
      <Circle size={ICON_SIZE} className="text-gray-400" />
    );

  const handleMove = async () => {
    makeMove(props.pos.x, props.pos.y, props.previewMark);
  };
  return (
    <Button
      ref={ref}
      variant="faded"
      className="relative h-32 w-32"
      isDisabled={state === "ended"}
      onPress={handleMove}
    >
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {isHovering && props.mark === EMPTY && PreviewIcon}
        {props.mark !== EMPTY && Icon}
      </span>
      {props.isCrossed && <Cross crossDir={props.crossDirection!} />}
    </Button>
  );
};

export default Tile;

type CrossProps = { crossDir: CrossDirection };
const Cross = (props: CrossProps) => {
  if (props.crossDir === "horizontal") {
    return (
      <span className="absolute w-full h-3 bg-secondary border-y-2 border-secondary-600" />
    );
  }

  if (props.crossDir === "vertical") {
    return (
      <span className="absolute h-full w-3 bg-secondary border-x-2 border-secondary-600" />
    );
  }

  if (props.crossDir === "cross-down") {
    return (
      <span className="absolute h-3 rotate-45 w-[200px] bg-secondary border-2 border-secondary-600" />
    );
  }

  if (props.crossDir === "cross-up") {
    return (
      <span className="absolute h-3 -rotate-45 w-[200px] bg-secondary border-2 border-secondary-600" />
    );
  }
};
