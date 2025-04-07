import { useGame } from "../useGame";
import { Button, ButtonGroup, ButtonProps, Tooltip } from "@nextui-org/react";
import { AiMode } from "../types";

const BottomBar = () => {
  const { changeAiMode, startNewGame, aiMode } = useGame();

  const getButtonProps = (mode: AiMode): ButtonProps => {
    return {
      variant: aiMode === mode ? "solid" : "bordered",
      onPress: () => changeAiMode(mode),
      disableAnimation: true,
      className: "font-semibold",
    };
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button variant="faded" onPress={startNewGame} className="font-semibold">
        Nowa gra
      </Button>
      <Tooltip content="Wybierz poziom trudności">
        <ButtonGroup>
          <Button {...getButtonProps("easy")}>Łatwy</Button>
          <Button {...getButtonProps("medium")}>Średni</Button>
          <Button {...getButtonProps("hard")}>Trudny</Button>
        </ButtonGroup>
      </Tooltip>
    </div>
  );
};

export default BottomBar;
