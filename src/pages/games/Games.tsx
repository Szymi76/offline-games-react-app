import { Card, CardHeader, Input, Spacer } from "@nextui-org/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type GameItem = {
  name: string;
  href: string;
};

const games: GameItem[] = [
  { name: "Kółko i Krzyżyk", href: "/game/tic-tac-toe" },
  { name: "2048", href: "/game/2048" },
  { name: "Saper", href: "/game/minesweeper" },
];

const Games = () => {
  const [searchInput, setSearchInput] = useState("");

  const filteredGames = useMemo(
    () =>
      games.filter((game) =>
        game.name.toLowerCase().includes(searchInput.toLowerCase()),
      ),
    [searchInput],
  );

  return (
    <main className="mx-auto max-w-lg px-5 pt-10">
      <div>
        <Input
          value={searchInput}
          onValueChange={setSearchInput}
          startContent={<Search />}
          variant="bordered"
          placeholder="Wyszukaj grę..."
          size="lg"
          fullWidth
        />
      </div>
      <Spacer y={10} />
      <div className="flex w-full flex-wrap gap-3">
        {filteredGames.map((game) => (
          <GameTile key={game.name} {...game} />
        ))}
      </div>
      {filteredGames.length === 0 && (
        <p className="font-semibold text-default-500">Nie znaleziono gier</p>
      )}
    </main>
  );
};

export default Games;

const GameTile = (props: GameItem) => {
  return (
    <Card
      as={Link}
      to={props.href}
      isHoverable
      isPressable
      className="grid h-32 w-32 place-content-center border border-default-300 text-center font-bold"
    >
      <CardHeader>{props.name}</CardHeader>
    </Card>
  );
};
