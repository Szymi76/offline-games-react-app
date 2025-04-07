import { Button, ButtonGroup, ButtonProps, Tooltip } from "@nextui-org/react";
import { GameMode } from "../types";
import useGame from "../useGame";
import { LocateFixed, Infinity } from "lucide-react";

const BottomBar = () => {
  const { changeMode, mode, startNewGame } = useGame();

  const buttonProps = (gameMode: GameMode): ButtonProps => {
    return {
      onPress: () => changeMode(gameMode),
      variant: gameMode === mode ? "solid" : "bordered",
      className: "font-semibold",
    };
  };

  return (
    <div className="flex flex-wrap justify-between gap-3">
      <Button variant="faded" onClick={startNewGame}>
        Nowa gra
      </Button>
      <ButtonGroup>
        <Tooltip content="Graj do osiągnięcia kafelka 2048">
          <Button startContent={<LocateFixed />} {...buttonProps("limited")}>
            Do 2048
          </Button>
        </Tooltip>
        <Tooltip content="Graj bez końca">
          <Button endContent={<Infinity />} {...buttonProps("unlimited")}>
            Bez końca
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default BottomBar;
