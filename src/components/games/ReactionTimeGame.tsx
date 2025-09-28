import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Zap, Trophy, RefreshCw, Target, Clock } from 'lucide-react';

interface ReactionTimeGameProps {
  onScoreUpdate: (score: number) => void;
}

type GameState = 'ready' | 'waiting' | 'react' | 'result' | 'finished';

export const ReactionTimeGame = ({ onScoreUpdate }: ReactionTimeGameProps) => {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [waitingTimeout, setWaitingTimeout] = useState<NodeJS.Timeout | null>(null);

  const totalRounds = 5;

  const startGame = () => {
    setGameState('ready');
    setCurrentRound(0);
    setReactionTimes([]);
    setCurrentReactionTime(null);
    setScore(0);
    startRound();
  };

  const startRound = () => {
    setGameState('waiting');
    setCurrentReactionTime(null);

    // Wait random time between 2-5 seconds before showing target
    const waitTime = Math.random() * 3000 + 2000;
    const timeout = setTimeout(() => {
      setStartTime(Date.now());
      setGameState('react');
    }, waitTime);

    setWaitingTimeout(timeout);
  };

  const handleReaction = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (waitingTimeout) {
        clearTimeout(waitingTimeout);
      }
      setGameState('result');
      setCurrentReactionTime(-1); // Flag for early click
      return;
    }

    if (gameState === 'react') {
      const reactionTime = Date.now() - startTime;
      setCurrentReactionTime(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
      
      // Calculate points based on reaction time
      let points = 0;
      if (reactionTime < 200) points = 100;
      else if (reactionTime < 300) points = 80;
      else if (reactionTime < 400) points = 60;
      else if (reactionTime < 500) points = 40;
      else if (reactionTime < 600) points = 20;
      else points = 10;

      setScore(prev => {
        const newScore = prev + points;
        onScoreUpdate(newScore);
        return newScore;
      });

      setGameState('result');
    }
  };

  const nextRound = () => {
    const nextRoundNum = currentRound + 1;
    setCurrentRound(nextRoundNum);
    
    if (nextRoundNum >= totalRounds) {
      setGameState('finished');
    } else {
      startRound();
    }
  };

  const getAverageTime = () => {
    const validTimes = reactionTimes.filter(time => time > 0);
    return validTimes.length > 0 
      ? Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length)
      : 0;
  };

  const getReactionRating = (time: number) => {
    if (time < 0) return { text: 'Too Early!', color: 'destructive', emoji: '❌' };
    if (time < 200) return { text: 'Lightning Fast!', color: 'success', emoji: '⚡' };
    if (time < 300) return { text: 'Excellent!', color: 'primary', emoji: '🔥' };
    if (time < 400) return { text: 'Good!', color: 'accent', emoji: '👍' };
    if (time < 500) return { text: 'Average', color: 'warning', emoji: '⏱️' };
    return { text: 'Slow', color: 'muted', emoji: '🐌' };
  };

  useEffect(() => {
    return () => {
      if (waitingTimeout) {
        clearTimeout(waitingTimeout);
      }
    };
  }, [waitingTimeout]);

  if (gameState === 'ready') {
    return (
      <div className="text-center py-12">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl font-bold mb-4">Reaction Time Test</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Test your reflexes! Click as fast as you can when the screen turns green.
            You'll complete {totalRounds} rounds.
          </p>
          <Button onClick={startGame} className="game-button text-lg px-8 py-4">
            <Zap className="h-5 w-5 mr-2" />
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const averageTime = getAverageTime();
    const rating = getReactionRating(averageTime);

    return (
      <div className="text-center py-12">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">{rating.emoji}</div>
          <h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
          
          <div className="bg-primary/20 border border-primary/50 rounded-lg p-6 max-w-md mx-auto mb-6">
            <div className="text-2xl font-bold text-primary mb-4">Final Score: {score}</div>
            
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span>Average Reaction Time:</span>
                <span className="font-bold">{averageTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Best Time:</span>
                <span className="font-bold text-success">
                  {Math.min(...reactionTimes.filter(t => t > 0))}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className={`font-bold text-${rating.color}`}>
                  {rating.text}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-2">Round Results:</h4>
            <div className="space-y-1">
              {reactionTimes.map((time, index) => {
                const roundRating = getReactionRating(time);
                return (
                  <div key={index} className="flex justify-between items-center">
                    <span>Round {index + 1}:</span>
                    <Badge variant="outline" className="text-sm">
                      {time < 0 ? 'Too Early!' : `${time}ms`} {roundRating.emoji}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Button onClick={startGame} className="neon-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Stats */}
      <div className="flex gap-4 justify-center mb-8">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          Score: {score}
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Round {currentRound + 1} of {totalRounds}
        </Badge>
      </div>

      {/* Reaction Area */}
      <Card 
        className={`
          aspect-square max-w-md mx-auto cursor-pointer transition-all duration-300 hover:scale-105 text-center flex items-center justify-center
          ${gameState === 'waiting' ? 'bg-destructive/20 border-destructive/50' :
            gameState === 'react' ? 'bg-success/20 border-success animate-glow-pulse' :
            'bg-muted'
          }
        `}
        onClick={handleReaction}
      >
        <div className="p-8">
          {gameState === 'waiting' && (
            <div className="animate-pulse">
              <Clock className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-bold text-destructive mb-2">Wait...</h3>
              <p className="text-muted-foreground">
                Get ready! Don't click until it turns green!
              </p>
            </div>
          )}
          
          {gameState === 'react' && (
            <div className="animate-bounce-gaming">
              <Target className="h-16 w-16 mx-auto mb-4 text-success" />
              <h3 className="text-xl font-bold text-success mb-2">CLICK NOW!</h3>
              <p className="text-muted-foreground">
                React as fast as you can!
              </p>
            </div>
          )}
          
          {gameState === 'result' && currentReactionTime !== null && (
            <div className="animate-zoom-in">
              {currentReactionTime < 0 ? (
                <>
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-xl font-bold text-destructive mb-2">Too Early!</h3>
                  <p className="text-muted-foreground mb-4">
                    Wait for the green signal next time!
                  </p>
                </>
              ) : (
                <>
                  <Timer className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {currentReactionTime}ms
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`text-lg px-4 py-2 mb-4 text-${getReactionRating(currentReactionTime).color}`}
                  >
                    {getReactionRating(currentReactionTime).text} {getReactionRating(currentReactionTime).emoji}
                  </Badge>
                </>
              )}
              
              <div className="mt-4">
                <Button onClick={nextRound} className="game-button">
                  {currentRound + 1 < totalRounds ? 'Next Round' : 'See Results'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <div className="text-center mt-8 text-sm text-muted-foreground max-w-md mx-auto">
        {gameState === 'waiting' && (
          <p>Wait for the red area to turn green, then click as fast as you can!</p>
        )}
        {gameState === 'react' && (
          <p>Click the green area now!</p>
        )}
        {gameState === 'result' && (
          <p>Great job! Get ready for the next round.</p>
        )}
      </div>

      {/* Previous Results */}
      {reactionTimes.length > 0 && gameState === 'result' && (
        <div className="mt-8 text-center">
          <h4 className="font-bold mb-2">Previous Times:</h4>
          <div className="flex gap-2 justify-center flex-wrap">
            {reactionTimes.map((time, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {time < 0 ? 'Early' : `${time}ms`}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};