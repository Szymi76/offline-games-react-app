import { Button, ButtonGroup, ButtonProps, Tooltip } from "@nextui-org/react";
import { Difficulty } from "../types";
import { useGame } from "../useGame";

const BottomBar = () => {
  const { setDifficulty, restartGame, difficulty } = useGame();

  const buttonProps = (newDifficulty: Difficulty): ButtonProps => {
    return {
      onPress: () => setDifficulty(newDifficulty),
      variant: difficulty === newDifficulty ? "solid" : "bordered",
      className: "font-semibold",
    };
  };

  return (
    <div className="flex justify-between">
      <Button variant="faded" onClick={() => restartGame()}>
        Nowa gra
      </Button>
      <Tooltip content="Wybierz trudności rozgrywki" placement="bottom">
        <ButtonGroup>
          <Button {...buttonProps("easy")}>Łatwy</Button>
          <Button {...buttonProps("medium")}>Średni</Button>
          <Button {...buttonProps("hard")}>Trudny</Button>
        </ButtonGroup>
      </Tooltip>
    </div>
  );
};

export default BottomBar;
