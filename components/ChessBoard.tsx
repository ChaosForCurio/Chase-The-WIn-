import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { PIECE_PATHS } from '../constants';
import { PieceType } from '../types';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
  orientation: 'white' | 'black';
  isAiThinking: boolean;
  lastMove: { from: string, to: string } | null;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoard: React.FC<ChessBoardProps> = ({ 
  game, 
  onMove, 
  orientation = 'white', 
  isAiThinking,
  lastMove 
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  
  // Helper to check if a square is a valid move target for the currently selected piece
  const isMoveValid = (targetSquare: string) => {
    return possibleMoves.includes(targetSquare);
  };

  const handleSquareClick = (square: Square) => {
    if (isAiThinking) return;

    // 1. If we have a selected square
    if (selectedSquare) {
      // 1a. If clicking the same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // 1b. If clicking a valid move destination, execute move
      if (isMoveValid(square)) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // 1c. If clicking another piece of the same color, switch selection
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(m => m.to));
        return;
      }

      // 1d. Clicking anywhere else (invalid empty square or enemy piece that can't be captured)
      setSelectedSquare(null);
      setPossibleMoves([]);
    } 
    // 2. If no square is selected
    else {
      const piece = game.get(square);
      // Select if it's the current player's piece
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(m => m.to));
      }
    }
  };

  const renderSquare = (rankIndex: number, fileIndex: number) => {
    const rank = RANKS[rankIndex];
    const file = FILES[fileIndex];
    const square = `${file}${rank}` as Square;
    const isLight = (rankIndex + fileIndex) % 2 === 0;
    
    const piece = game.get(square);
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isLastMoveFrom = lastMove?.from === square;
    const isLastMoveTo = lastMove?.to === square;
    const inCheck = piece?.type === PieceType.k && piece?.color === game.turn() && game.inCheck();
    
    // Determine if this possible move is a capture
    const isCapture = isPossibleMove && piece !== null;

    // Base background color
    let bgColorClass = isLight ? 'bg-board-light' : 'bg-board-dark';

    // Prioritize background styles
    let customBgStyle: React.CSSProperties = {};

    if (inCheck) {
        // Red radial gradient for check
        customBgStyle = { 
            background: 'radial-gradient(circle at center, #ef4444 0%, #dc2626 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        };
    } else if (isSelected) {
        // Bright distinct yellow-green for selected
        customBgStyle = { backgroundColor: 'rgba(255, 255, 51, 0.6)' }; 
    } else if (isLastMoveFrom || isLastMoveTo) {
        // Subtle yellow highlight for last move
        customBgStyle = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }

    // Overlays for possible moves
    let overlay = null;
    if (isPossibleMove) {
        if (isCapture) {
             // Ring for captures
             overlay = (
                <div className="absolute inset-0 z-20 pointer-events-none">
                     <div className="absolute inset-0 rounded-full border-[6px] border-black/10 opacity-60"></div>
                     <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                </div>
             );
        } else {
             // Large dot for empty square moves
             overlay = (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-[30%] h-[30%] bg-black/15 rounded-full"></div>
                </div>
             );
        }
    }

    return (
      <div
        key={square}
        data-square={square}
        onClick={() => handleSquareClick(square)}
        className={`relative w-full h-full flex items-center justify-center cursor-pointer ${!Object.keys(customBgStyle).length ? bgColorClass : ''} transition-all duration-150 select-none`}
        style={customBgStyle}
      >
        {/* Rank/File Labels (only visible on specific squares) */}
        {fileIndex === 0 && (
          <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${isLight ? 'text-board-dark' : 'text-board-light'} opacity-100 z-0`}>
            {rank}
          </span>
        )}
        {rankIndex === 7 && (
          <span className={`absolute bottom-0 right-1 text-[10px] font-bold ${isLight ? 'text-board-dark' : 'text-board-light'} opacity-100 z-0`}>
            {file}
          </span>
        )}

        {/* Highlight Overlay */}
        {overlay}

        {/* Piece SVG */}
        {piece && (
          <div className={`w-[90%] h-[90%] z-10 drop-shadow-lg pointer-events-none transition-transform duration-200 ${isSelected ? 'scale-110 -translate-y-1' : ''}`}>
             <svg viewBox="0 0 45 45" className="w-full h-full">
                {PIECE_PATHS[`${piece.color}${piece.type}`]}
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[600px] aspect-square rounded-lg overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-800 select-none">
      <div className="grid grid-rows-8 grid-cols-8 w-full h-full">
        {RANKS.map((_, rankIndex) => 
          FILES.map((_, fileIndex) => renderSquare(rankIndex, fileIndex))
        )}
      </div>
    </div>
  );
};