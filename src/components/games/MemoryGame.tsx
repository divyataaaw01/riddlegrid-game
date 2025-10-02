import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Star, 
  Zap, 
  Target, 
  Trophy, 
  Diamond, 
  Crown, 
  Sparkles,
  Timer,
  RefreshCw
} from 'lucide-react';

interface MemoryGameProps {
  onScoreUpdate: (score: number) => void;
}

const icons = [Heart, Star, Zap, Target, Trophy, Diamond, Crown, Sparkles];

interface Card {
  id: number;
  icon: typeof Heart;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = ({ onScoreUpdate }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  const initializeGame = () => {
    const gameCards: Card[] = [];
    icons.forEach((icon, index) => {
      // Add two cards for each icon
      gameCards.push(
        { id: index * 2, icon, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, icon, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
    setTimer(0);
    setGameStarted(true);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find(c => c.id === cardId)?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update cards to show flipped state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.icon === secondCard?.icon) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setScore(prev => {
            const newScore = prev + 100;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFlippedCards([]);
          
          // Check if game is won
          const allMatched = cards.every(card => 
            card.id === firstId || card.id === secondId || card.isMatched
          );
          if (allMatched) {
            setGameWon(true);
            const timeBonus = Math.max(0, 1000 - timer * 10);
            const moveBonus = Math.max(0, 500 - moves * 25);
            const finalScore = score + 100 + timeBonus + moveBonus;
            setScore(finalScore);
            onScoreUpdate(finalScore);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="text-center py-12">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-3xl font-bold mb-4">Memory Master</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Flip cards to find matching pairs. Complete all matches to win!
          </p>
          
          <Card className="p-6 mb-8 max-w-lg mx-auto text-left">
            <h3 className="text-lg font-bold mb-4 text-center">📖 How to Play</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Click on cards to flip them over and reveal icons</li>
              <li>• Find matching pairs of icons</li>
              <li>• Only 2 cards can be flipped at a time</li>
              <li>• Match all pairs to win</li>
              <li>• Complete faster with fewer moves for bonus points!</li>
            </ul>
          </Card>

          <Button onClick={initializeGame} className="game-button text-lg px-8 py-4">
            <Sparkles className="h-5 w-5 mr-2" />
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Stats */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          Score: {score}
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Target className="h-4 w-4 mr-2" />
          Moves: {moves}
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Timer className="h-4 w-4 mr-2" />
          Time: {formatTime(timer)}
        </Badge>
      </div>

      {gameWon && (
        <div className="text-center mb-8 animate-zoom-in">
          <div className="bg-primary/20 border border-primary/50 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Congratulations!</h3>
            <p className="text-muted-foreground mb-4">
              You completed the game in {moves} moves and {formatTime(timer)}!
            </p>
            <Button onClick={initializeGame} className="neon-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className={`
                aspect-square cursor-pointer transition-all duration-300 hover:scale-105
                ${card.isFlipped || card.isMatched ? 'bg-primary/20 border-primary/50' : 'bg-muted hover:bg-muted/80'}
                ${card.isMatched ? 'animate-bounce-gaming' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {card.isFlipped || card.isMatched ? (
                  <IconComponent className={`h-8 w-8 ${card.isMatched ? 'text-primary animate-glow-pulse' : 'text-primary'}`} />
                ) : (
                  <div className="w-8 h-8 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" onClick={initializeGame} className="mr-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Game
        </Button>
      </div>
    </div>
  );
};