import React from 'react';
import { GameStatus } from '../types';
import { RotateCcw, Trophy, User, Cpu } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  onRestart: () => void;
  winner?: 'You' | 'Gemini AI';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ status, onRestart, winner }) => {
  if (status === GameStatus.IN_PROGRESS) {
    return null;
  }

  let title = "Game Over";
  let Icon = Trophy;

  if (status === GameStatus.CHECKMATE && winner) {
    title = `${winner} Won!`;
    Icon = winner === 'You' ? User : Cpu;
  } else if (status === GameStatus.DRAW) {
    title = "It's a Draw!";
  } else {
    title = status.replace(/_/g, ' ');
  }

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl text-center p-8 m-4 max-w-sm w-full animate-fade-in-scale">
        <div className="flex justify-center items-center mx-auto bg-slate-700 rounded-full w-20 h-20 border-4 border-slate-600">
          <Icon className="w-10 h-10 text-yellow-400" />
        </div>
        <h2 className="text-3xl font-bold mt-6 text-white">{title}</h2>
        <p className="text-slate-400 mt-2">
          {status === GameStatus.CHECKMATE
            ? `By checkmate.`
            : `The game has ended in a ${status.toLowerCase().replace(/_/g, ' ')}.`}
        </p>
        <button
          onClick={onRestart}
          className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-lg shadow-lg"
        >
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>
      </div>
    </div>
  );
};
