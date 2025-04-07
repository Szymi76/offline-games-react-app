type Cords = { x: number; y: number };

type Tile = {
  id: string;
  cords: Cords;
  value: number;
};

type RenderTile = Tile & {
  from?: Cords | null;
  isMerged?: Cords;
  isNew?: boolean;
};

type MoveDirection = "to-left" | "to-right" | "to-top" | "to-bottom";

type Board = Tile[][];
type RenderBoard = RenderTile[][];

type GameMode = "limited" | "unlimited";

export const mappedRotations = new Map<MoveDirection, number>([
  ["to-left", 0],
  ["to-bottom", 3],
  ["to-right", 2],
  ["to-top", 1],
]);

export type {
  Cords,
  Tile,
  RenderTile,
  Board,
  RenderBoard,
  MoveDirection,
  GameMode,
};
