export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CHECKMATE = 'CHECKMATE',
  DRAW = 'DRAW',
  STALEMATE = 'STALEMATE',
  INSUFFICIENT_MATERIAL = 'INSUFFICIENT_MATERIAL',
  THREEFOLD_REPETITION = 'THREEFOLD_REPETITION',
}

export enum PieceType {
  p = 'p',
  n = 'n',
  b = 'b',
  r = 'r',
  q = 'q',
  k = 'k',
}

export enum PieceColor {
  w = 'w',
  b = 'b',
}

export enum Difficulty {
  BEGINNER = 'BEGINNER', // Fast, less thinking
  GRANDMASTER = 'GRANDMASTER', // Slower, deeper thinking
}

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string; // 'q', 'r', 'b', 'n'
  san?: string;
}

export interface MoveHistoryItem {
  white: string;
  black?: string;
  moveNumber: number;
}
