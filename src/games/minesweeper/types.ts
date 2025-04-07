export type Cords = [number, number];
export type Difficulty = "easy" | "medium" | "hard";

export type Field = {
  id: string;
  cords: Cords;
  isMine: boolean;
  value: number;
  isReveled: boolean;
  revealDaley?: number;
  isFlagged: boolean;
};

export type Board = Field[][];
