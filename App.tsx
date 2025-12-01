import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { GameOverModal } from './components/GameOverModal';
import { getGeminiMove } from './services/geminiService';
import { Difficulty, GameStatus } from './types';
import { RotateCcw, Settings, Trophy, Cpu, User } from 'lucide-react';
import { PIECE_PATHS } from './constants';

const CapturedPiecesDisplay: React.FC<{ pieces: string[], label?: string }> = ({ pieces, label }) => {
  // Value for sorting: Q=9, R=5, B=3, N=3, P=1
  const getValue = (p: string) => {
     switch(p[1]) {
         case 'q': return 9;
         case 'r': return 5;
         case 'b': return 3;
         case 'n': return 3;
         case 'p': return 1;
         default: return 0;
     }
  };
  
  const sortedPieces = [...pieces].sort((a, b) => getValue(b) - getValue(a));

  return (
    <div className="flex flex-col gap-1 mt-2">
      {label && <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>}
      <div className="flex flex-wrap gap-1 min-h-[2.5rem] bg-slate-900/30 p-2 rounded-lg border border-slate-700/30 items-center">
        {sortedPieces.length === 0 ? (
           <span className="text-xs text-slate-600 italic px-1">No captures</span>
        ) : (
            sortedPieces.map((p, i) => (
                <div key={i} className="w-6 h-6 drop-shadow-sm opacity-90 hover:scale-110 transition-transform">
                <svg viewBox="0 0 45 45" className="w-full h-full">
                        {PIECE_PATHS[p]}
                </svg>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const historyEndRef = useRef<HTMLTableRowElement>(null);
  
  // Ref to track if we should trigger AI to prevent double firing in React strict mode
  const turnProcessed = useRef<string>("");

  const makeMove = useCallback((from: string, to: string) => {
    try {
      const moveResult = game.move({ from, to, promotion: 'q' }); // Auto-promote to Queen for simplicity
      if (moveResult) {
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setLastMove({ from: moveResult.from, to: moveResult.to });
        setHistory(prev => [...prev, moveResult.san]);
        
        // Track captures
        if (moveResult.captured) {
            // If White moved (color='w'), they captured Black ('b' + piece type)
            const capturedPiece = (moveResult.color === 'w' ? 'b' : 'w') + moveResult.captured;
            setCaptures(prev => [...prev, capturedPiece]);
        }

        checkStatus(newGame);
        return true;
      }
    } catch (e) {
      console.error("Invalid move", e);
    }
    return false;
  }, [game]);

  const checkStatus = (currentInfo: Chess) => {
    if (currentInfo.isCheckmate()) setStatus(GameStatus.CHECKMATE);
    else if (currentInfo.isDraw()) setStatus(GameStatus.DRAW);
    else if (currentInfo.isStalemate()) setStatus(GameStatus.STALEMATE);
    else if (currentInfo.isThreefoldRepetition()) setStatus(GameStatus.THREEFOLD_REPETITION);
    else if (currentInfo.isInsufficientMaterial()) setStatus(GameStatus.INSUFFICIENT_MATERIAL);
    else setStatus(GameStatus.IN_PROGRESS);
  };

  const triggerAiMove = useCallback(async () => {
    if (status !== GameStatus.IN_PROGRESS) return;
    
    // Check if we already processed this turn (simple safeguard)
    const currentFen = game.fen();
    if (turnProcessed.current === currentFen) return;
    turnProcessed.current = currentFen;

    setAiThinking(true);
    setAiExplanation("Analyzing position...");

    try {
      const moves = game.moves();
      if (moves.length > 0) {
        const response = await getGeminiMove(currentFen, moves, difficulty);
        
        // Short delay for visual pacing
        if (difficulty === Difficulty.BEGINNER) {
            await new Promise(r => setTimeout(r, 800));
        }

        const moveMade = game.move(response.move);
        if (moveMade) {
            const newGame = new Chess(game.fen());
            setGame(newGame);
            setLastMove({ from: moveMade.from, to: moveMade.to });
            setHistory(prev => [...prev, moveMade.san]);
            setAiExplanation(response.explanation);

             // Track captures for AI
            if (moveMade.captured) {
                // If AI (Black) moved, they captured White ('w' + piece type)
                const capturedPiece = (moveMade.color === 'w' ? 'b' : 'w') + moveMade.captured;
                setCaptures(prev => [...prev, capturedPiece]);
            }

            checkStatus(newGame);
        }
      }
    } catch (e) {
      console.error("AI Move Error", e);
      setAiExplanation("I stumbled. Your turn.");
    } finally {
      setAiThinking(false);
    }
  }, [game, difficulty, status]);

  // Effect to trigger AI when it's black's turn
  useEffect(() => {
    if (game.turn() === 'b' && status === GameStatus.IN_PROGRESS) {
      triggerAiMove();
    }
  }, [game, status, triggerAiMove]);

  // Auto-scroll history
  useEffect(() => {
    if (historyEndRef.current) {
        historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleReset = () => {
    const newGame = new Chess();
    setGame(newGame);
    setStatus(GameStatus.IN_PROGRESS);
    setHistory([]);
    setLastMove(null);
    setAiExplanation("");
    setCaptures([]);
    turnProcessed.current = "";
  };

  // Filter captures for display
  const whiteCaptures = captures.filter(p => p.startsWith('b')); // Pieces White has captured (Black pieces)
  const blackCaptures = captures.filter(p => p.startsWith('w')); // Pieces Black has captured (White pieces)

  // Determine winner for the modal
  const winner = status === GameStatus.CHECKMATE
    ? (game.turn() === 'b' ? 'You' : 'Gemini AI')
    : undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 font-sans">
      <GameOverModal status={status} onRestart={handleReset} winner={winner} />
      
      {/* Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
        {/* Status - Left on Desktop, Below on Mobile */}
        <div className="flex-1 flex justify-start w-full md:w-auto order-2 md:order-1">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${status === GameStatus.IN_PROGRESS ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-slate-300">{status.replace(/_/g, ' ')}</span>
            </div>
        </div>

        {/* Title - Center */}
        <div className="flex items-center gap-3 justify-center flex-1 w-full md:w-auto order-1 md:order-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Trophy className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 whitespace-nowrap">
                Gemini Chess Master
            </h1>
        </div>

        {/* Right Spacer for Balance */}
        <div className="flex-1 hidden md:flex justify-end order-3">
             {/* Empty to balance flex for true centering of title */}
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-[320px_auto_320px] gap-8 items-start">
        
        {/* LEFT COLUMN: Gemini AI */}
        <div className="flex flex-col gap-6 order-2 lg:order-1 h-full">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4 sticky top-4">
                 {/* Gemini Header */}
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Cpu className={`w-6 h-6 ${aiThinking ? 'text-indigo-400 animate-spin-slow' : 'text-slate-400'}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white">Gemini AI</h3>
                            <p className="text-xs text-indigo-300 font-mono">
                                {difficulty === Difficulty.GRANDMASTER ? 'Grandmaster' : 'Standard'}
                            </p>
                        </div>
                    </div>
                     {game.turn() === 'b' && (
                        <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30 animate-pulse">
                            Thinking
                        </div>
                    )}
                </div>
                
                {/* Captured by Gemini */}
                <CapturedPiecesDisplay pieces={blackCaptures} label="AI Advantage" />

                {/* AI Commentary Bubble */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 min-h-[100px] relative mt-2 flex items-center">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-900 border-t border-l border-slate-700 transform rotate-45"></div>
                    <p className="text-sm text-slate-300 italic">
                        "{aiExplanation || "I am ready. Make your move."}"
                    </p>
                </div>
            </div>
        </div>

        {/* CENTER COLUMN: Board Only */}
        <div className="flex flex-col items-center gap-6 order-1 lg:order-2 w-full">
           <ChessBoard 
              game={game} 
              onMove={makeMove} 
              orientation="white"
              isAiThinking={aiThinking || status !== GameStatus.IN_PROGRESS}
              lastMove={lastMove}
            />
        </div>

        {/* RIGHT COLUMN: User & Controls & History */}
        <div className="flex flex-col gap-6 order-3 h-full">
            
            {/* User Panel */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <User className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white">You</h3>
                            <p className="text-xs text-emerald-300">White Pieces</p>
                        </div>
                    </div>
                     {game.turn() === 'w' && (
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">
                            Your Turn
                        </div>
                    )}
                </div>

                {/* Captured by User */}
                <CapturedPiecesDisplay pieces={whiteCaptures} label="Your Advantage" />

                {/* Controls */}
                <div className="mt-2 space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                        <button
                            onClick={() => setDifficulty(Difficulty.BEGINNER)}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${difficulty === Difficulty.BEGINNER ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Quick
                        </button>
                        <button
                            onClick={() => setDifficulty(Difficulty.GRANDMASTER)}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${difficulty === Difficulty.GRANDMASTER ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Grandmaster
                        </button>
                    </div>

                    <button 
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all font-medium border border-slate-600 hover:border-slate-500 text-sm shadow-md"
                    >
                        <RotateCcw className="w-4 h-4" /> New Game
                    </button>
                </div>
            </div>

            {/* History Panel - Moved here */}
            <div className="w-full flex flex-col flex-1 min-h-[250px] bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                 <div className="p-3 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
                        <Settings className="w-4 h-4" /> Move History
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">
                        {Math.ceil(history.length / 2)} moves
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center text-slate-500 py-10 text-sm italic">Game hasn't started</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                             <thead className="bg-slate-900/90 text-slate-400 font-medium sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                                 <tr>
                                     <th className="px-4 py-2 w-12">#</th>
                                     <th className="px-4 py-2">White</th>
                                     <th className="px-4 py-2">Black</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-700/50">
                                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-2 text-slate-500 font-mono border-r border-slate-700/50 bg-slate-900/20">{i + 1}</td>
                                        <td className="px-4 py-2 text-slate-300 font-medium">{history[i * 2]}</td>
                                        <td className="px-4 py-2 text-slate-300 font-medium">{history[i * 2 + 1] || ''}</td>
                                    </tr>
                                ))}
                                <tr ref={historyEndRef} />
                             </tbody>
                        </table>
                    )}
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
}