const SIZE = 3;

type Side = "x" | "o";
type Tile = {
  side: Side | null;
  cords: [number, number];
  isWinningTile: boolean;
};

type Board = Tile[][];
type AiMode = "easy" | "medium" | "hard";
type Score = { player: number; ai: number };

export { SIZE };
export type { Side, Tile, Board, AiMode, Score };
