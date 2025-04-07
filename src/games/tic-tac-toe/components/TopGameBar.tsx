import { Button, ButtonGroup, Tab, Tabs } from "@nextui-org/react";
import { GameMode, useGame } from "../context";
import { RotateCcw, Sword } from "lucide-react";

const gameModes: GameMode[] = ["easy", "medium", "hard"];
const gameTitles = new Map<GameMode, string>([
  ["easy", "Łatwy"],
  ["medium", "Średni"],
  ["hard", "Trudny"],
]);

const TopGameBar = () => {
  const game = useGame();

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg border-2 border-default-200 bg-default-100 p-2">
      <Tabs
        variant="bordered"
        selectedKey={game.mode}
        onSelectionChange={(key) => game.changeMode(key as GameMode)}
      >
        {gameModes.map((gameMode) => {
          return <Tab key={gameMode} title={gameTitles.get(gameMode)} />;
        })}
      </Tabs>
      {/* <Button startContent={<Sword />}>Poziom bota: Losowy</Button> */}
      <ButtonGroup>
        <Button
          onPress={() => game.chooseMarkAndStartGame("x")}
          variant={game.playerMark === "x" ? "solid" : "bordered"}
          isIconOnly
        >
          X
        </Button>
        <Button
          onPress={() => game.chooseMarkAndStartGame("o")}
          variant={game.playerMark === "o" ? "solid" : "bordered"}
          isIconOnly
        >
          O
        </Button>
      </ButtonGroup>

      <Button
        variant="flat"
        isIconOnly
        startContent={<RotateCcw size={18} />}
        onPress={() => game.restart()}
      />
    </div>
  );
};

export default TopGameBar;
