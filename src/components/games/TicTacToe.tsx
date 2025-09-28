import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Circle, Trophy, RefreshCw, User, Bot } from 'lucide-react';

interface TicTacToeProps {
  onScoreUpdate: (score: number) => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

export const TicTacToe = ({ onScoreUpdate }: TicTacToeProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'draw'>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameMode, setGameMode] = useState<'human' | 'ai'>('ai');
  const [moveHistory, setMoveHistory] = useState<{player: 'X' | 'O', position: number, moveNumber: number}[]>([]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): Player | 'draw' => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell !== null) ? 'draw' : null;
  };

  const makeMove = (index: number, player: 'X' | 'O') => {
    if (board[index] || winner) return false;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    // Add move to history
    setMoveHistory(prev => [...prev, { player, position: index, moveNumber: prev.length + 1 }]);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult === 'X') {
        const newScore = playerScore + 100;
        setPlayerScore(newScore);
        onScoreUpdate(newScore);
      } else if (gameResult === 'O' && gameMode === 'ai') {
        setAiScore(prev => prev + 100);
      }
      return true;
    }

    return true;
  };

  const handleCellClick = (index: number) => {
    if (gameMode === 'ai' && currentPlayer === 'O') return;
    
    if (makeMove(index, currentPlayer)) {
      if (!winner) {
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
        
        // AI move
        if (gameMode === 'ai' && nextPlayer === 'O') {
          setTimeout(() => makeAIMove([...board]), 500);
        }
      }
    }
  };

  const makeAIMove = (currentBoard: Board) => {
    if (winner) return;

    // Simple AI that tries to win, block, or take center/corners
    const emptyCells = currentBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    // Check if AI can win
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = 'O';
      if (checkWinner(testBoard) === 'O') {
        makeAIMove_execute(cell);
        return;
      }
    }

    // Check if AI needs to block player
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = 'X';
      if (checkWinner(testBoard) === 'X') {
        makeAIMove_execute(cell);
        return;
      }
    }

    // Take center if available
    if (emptyCells.includes(4)) {
      makeAIMove_execute(4);
      return;
    }

    // Take corners
    const corners = [0, 2, 6, 8].filter(corner => emptyCells.includes(corner));
    if (corners.length > 0) {
      makeAIMove_execute(corners[Math.floor(Math.random() * corners.length)]);
      return;
    }

    // Take any available cell
    if (emptyCells.length > 0) {
      makeAIMove_execute(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
    }
  };

  const makeAIMove_execute = (index: number) => {
    if (makeMove(index, 'O')) {
      setCurrentPlayer('X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setMoveHistory([]);
  };

  const resetScores = () => {
    setPlayerScore(0);
    setAiScore(0);
    onScoreUpdate(0);
    setMoveHistory([]);
  };

  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <Card
        key={index}
        className={`
          aspect-square cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-primary/10
          ${value ? 'bg-primary/20 border-primary/50' : 'bg-muted hover:bg-muted/80'}
          ${winner && !value ? 'opacity-50' : ''}
        `}
        onClick={() => handleCellClick(index)}
      >
        <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
          {value === 'X' && <X className="h-12 w-12 text-primary animate-zoom-in" />}
          {value === 'O' && <Circle className="h-12 w-12 text-secondary animate-zoom-in" />}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Game Mode Selection */}
      <div className="mb-8">
        <div className="flex gap-4 justify-center mb-4">
          <Button 
            variant={gameMode === 'ai' ? 'default' : 'outline'}
            onClick={() => {
              setGameMode('ai');
              resetGame();
            }}
            className="game-button"
          >
            <Bot className="h-4 w-4 mr-2" />
            vs AI
          </Button>
          <Button 
            variant={gameMode === 'human' ? 'default' : 'outline'}
            onClick={() => {
              setGameMode('human');
              resetGame();
            }}
            className="neon-button"
          >
            <User className="h-4 w-4 mr-2" />
            vs Human
          </Button>
        </div>
      </div>

      {/* Scores */}
      <div className="flex gap-4 justify-center mb-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          You: {playerScore}
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          {gameMode === 'ai' ? 'AI' : 'Player 2'}: {aiScore}
        </Badge>
      </div>

      {/* Game Status */}
      <div className="mb-6">
        {winner ? (
          <div className="animate-zoom-in">
            {winner === 'draw' ? (
              <Badge variant="outline" className="text-xl px-6 py-3">
                It's a Draw! 🤝
              </Badge>
            ) : (
              <Badge 
                variant="default" 
                className={`text-xl px-6 py-3 ${winner === 'X' ? 'bg-primary glow-effect' : 'bg-secondary neon-effect'}`}
              >
                {winner === 'X' ? '🎉 You Win!' : `🤖 ${gameMode === 'ai' ? 'AI' : 'Player 2'} Wins!`}
              </Badge>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="text-lg px-4 py-2">
            Current Turn: {currentPlayer === 'X' ? '✖️ Your' : `⭕ ${gameMode === 'ai' ? 'AI' : 'Player 2'}`} Turn
          </Badge>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>

      {/* Move History */}
      {moveHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Move History</h3>
          <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {moveHistory.map((move) => (
                <div
                  key={move.moveNumber}
                  className={`text-sm p-2 rounded flex items-center gap-2 ${
                    move.player === 'X' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary/20 text-secondary'
                  }`}
                >
                  <span className="font-mono text-xs">#{move.moveNumber}</span>
                  {move.player === 'X' ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  <span>Position {move.position + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="flex gap-4 justify-center">
        <Button onClick={resetGame} className="game-button">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Game
        </Button>
        <Button variant="outline" onClick={resetScores}>
          Reset Scores
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-sm text-muted-foreground max-w-md mx-auto">
        <p>Get three in a row to win! Play against our smart AI or with a friend.</p>
      </div>
    </div>
  );
};