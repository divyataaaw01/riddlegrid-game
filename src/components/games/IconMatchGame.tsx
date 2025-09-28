import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Star, Zap, Target, Trophy, Diamond, Crown, Sparkles,
  Timer, RefreshCw, Flame, Shield, Sword, Gem, Bolt, Sun
} from 'lucide-react';

interface IconMatchGameProps {
  onScoreUpdate: (score: number) => void;
}

const gameIcons = [Heart, Star, Zap, Target, Trophy, Diamond, Crown, Sparkles, Flame, Shield, Sword, Gem, Bolt, Sun];

interface GameIcon {
  id: number;
  Icon: typeof Heart;
  matched: boolean;
}

export const IconMatchGame = ({ onScoreUpdate }: IconMatchGameProps) => {
  const [targetIcon, setTargetIcon] = useState<typeof Heart | null>(null);
  const [gameIcons_state, setGameIconsState] = useState<GameIcon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Initialize game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setGameOver(false);
    setStreak(0);
    generateNewRound();
  };

  const generateNewRound = () => {
    // Pick a random target icon
    const randomTarget = gameIcons[Math.floor(Math.random() * gameIcons.length)];
    setTargetIcon(randomTarget);

    // Generate 12 icons with the target appearing 2-4 times randomly
    const targetCount = Math.floor(Math.random() * 3) + 2; // 2-4 targets
    const icons: GameIcon[] = [];

    // Add target icons
    for (let i = 0; i < targetCount; i++) {
      icons.push({ id: i, Icon: randomTarget, matched: false });
    }

    // Fill remaining slots with random icons (avoiding the target)
    const otherIcons = gameIcons.filter(icon => icon !== randomTarget);
    while (icons.length < 12) {
      const randomIcon = otherIcons[Math.floor(Math.random() * otherIcons.length)];
      icons.push({ id: icons.length, Icon: randomIcon, matched: false });
    }

    // Shuffle the array
    const shuffled = icons.sort(() => Math.random() - 0.5).map((icon, index) => ({ ...icon, id: index }));
    setGameIconsState(shuffled);
  };

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  const handleIconClick = (clickedIcon: GameIcon) => {
    if (!gameActive || clickedIcon.matched) return;

    const isCorrect = clickedIcon.Icon === targetIcon;
    
    if (isCorrect) {
      // Mark as matched
      setGameIconsState(prev => 
        prev.map(icon => 
          icon.id === clickedIcon.id ? { ...icon, matched: true } : icon
        )
      );

      // Update score and streak
      const points = 10 + (streak * 2); // Bonus points for streaks
      setScore(prev => {
        const newScore = prev + points;
        onScoreUpdate(newScore);
        return newScore;
      });
      setStreak(prev => prev + 1);

      // Check if all targets are matched
      const remainingTargets = gameIcons_state.filter(icon => 
        icon.Icon === targetIcon && !icon.matched && icon.id !== clickedIcon.id
      ).length;

      if (remainingTargets === 0) {
        // All targets found, generate new round
        setTimeout(() => {
          generateNewRound();
          setTimeLeft(prev => Math.min(prev + 5, 60)); // Bonus time
        }, 500);
      }
    } else {
      // Wrong icon clicked - lose streak and time penalty
      setStreak(0);
      setTimeLeft(prev => Math.max(prev - 3, 0));
    }
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    if (streak > bestStreak) {
      setBestStreak(streak);
    }
  };

  if (!gameActive && !gameOver) {
    return (
      <div className="text-center py-12">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl font-bold mb-4">Icon Matcher</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Match all instances of the target icon as fast as you can! 
            Build streaks for bonus points, but avoid wrong clicks!
          </p>
          <Button onClick={startGame} className="game-button text-lg px-8 py-4">
            <Sparkles className="h-5 w-5 mr-2" />
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center py-12">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">
            {score >= 200 ? '🏆' : score >= 100 ? '🎉' : '💪'}
          </div>
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <div className="bg-primary/20 border border-primary/50 rounded-lg p-6 max-w-md mx-auto mb-6">
            <div className="text-2xl font-bold text-primary mb-2">Final Score: {score}</div>
            <p className="text-muted-foreground mb-2">
              Best Streak: {bestStreak} icons
            </p>
            <p className="text-sm text-muted-foreground">
              {score >= 200 ? 'Incredible reflexes!' : 
               score >= 100 ? 'Great job!' : 'Keep practicing!'}
            </p>
          </div>
          <Button onClick={startGame} className="neon-button mr-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
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
        <Badge variant="outline" className={`text-lg px-4 py-2 ${timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}`}>
          <Timer className="h-4 w-4 mr-2" />
          Time: {timeLeft}s
        </Badge>
        <Badge variant="outline" className={`text-lg px-4 py-2 ${streak > 0 ? 'text-primary animate-glow-pulse' : ''}`}>
          <Zap className="h-4 w-4 mr-2" />
          Streak: {streak}
        </Badge>
      </div>

      {/* Target Icon Display */}
      {targetIcon && (
        <div className="text-center mb-8">
          <Card className="inline-block p-6 bg-primary/20 border-primary/50 animate-glow-pulse">
            <p className="text-sm text-muted-foreground mb-2">Find all instances of:</p>
            <div className="inline-flex p-4 rounded-full bg-primary/30">
              {targetIcon && React.createElement(targetIcon, { className: "h-12 w-12 text-primary" })}
            </div>
          </Card>
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {gameIcons_state.map((gameIcon) => {
          const IconComponent = gameIcon.Icon;
          return (
            <Card
              key={gameIcon.id}
              className={`
                aspect-square cursor-pointer transition-all duration-300 hover:scale-105
                ${gameIcon.matched 
                  ? 'bg-success/20 border-success animate-bounce-gaming' 
                  : 'bg-muted hover:bg-muted/80 hover:border-primary/50'
                }
              `}
              onClick={() => handleIconClick(gameIcon)}
            >
              <div className="w-full h-full flex items-center justify-center">
                <IconComponent className={`h-8 w-8 ${
                  gameIcon.matched ? 'text-success' : 'text-foreground'
                }`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Click all icons matching the target above. Build streaks for bonus points!</p>
        <p>Wrong clicks break your streak and cost time.</p>
      </div>
    </div>
  );
};