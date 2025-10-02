import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Zap, 
  Ear, 
  Trophy,
  Timer,
  ArrowLeft
} from 'lucide-react';

interface AudioGamesProps {
  onScoreUpdate: (score: number) => void;
}

type AudioGame = 'menu' | 'sequence' | 'frequency' | 'rhythm';

// Audio context and oscillator setup
const createBeep = (frequency: number, duration: number) => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
  
  return new Promise(resolve => {
    oscillator.onended = () => {
      audioContext.close();
      resolve(void 0);
    };
  });
};

const playSequence = async (frequencies: number[], duration: number = 0.5, gap: number = 0.2) => {
  for (let i = 0; i < frequencies.length; i++) {
    await createBeep(frequencies[i], duration);
    if (i < frequencies.length - 1) {
      await new Promise(resolve => setTimeout(resolve, gap * 1000));
    }
  }
};

export const AudioGames = ({ onScoreUpdate }: AudioGamesProps) => {
  const [currentGame, setCurrentGame] = useState<AudioGame>('menu');
  const [isPlaying, setIsPlaying] = useState(false);

  // Simon Says Game State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Frequency Test Game State
  const [currentFrequency, setCurrentFrequency] = useState(440);
  const [targetFrequency, setTargetFrequency] = useState(440);
  const [frequencyGuess, setFrequencyGuess] = useState(440);
  const [frequencyScore, setFrequencyScore] = useState(0);
  const [frequencyRound, setFrequencyRound] = useState(1);
  const [frequencyGameOver, setFrequencyGameOver] = useState(false);

  // Rhythm Game State
  const [rhythmPattern, setRhythmPattern] = useState<number[]>([]);
  const [userRhythm, setUserRhythm] = useState<number[]>([]);
  const [rhythmStartTime, setRhythmStartTime] = useState(0);
  const [rhythmRecording, setRhythmRecording] = useState(false);
  const [rhythmLevel, setRhythmLevel] = useState(1);
  const [rhythmGameOver, setRhythmGameOver] = useState(false);

  const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  // Simon Says Functions
  const startSimonGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setUserSequence([]);
    setLevel(1);
    setIsUserTurn(false);
    setGameOver(false);
    setTimeout(() => playSimonSequence([Math.floor(Math.random() * 4)]), 500);
  };

  const playSimonSequence = async (seq: number[]) => {
    setIsPlaying(true);
    setIsUserTurn(false);
    await playSequence(seq.map(i => frequencies[i]));
    setIsPlaying(false);
    setIsUserTurn(true);
  };

  const handleSimonButton = async (index: number) => {
    if (!isUserTurn || isPlaying) return;

    await createBeep(frequencies[index], 0.3);
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong answer
      setGameOver(true);
      setIsUserTurn(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      // Level completed
      const points = level * 50;
      onScoreUpdate(points);
      
      if (level >= 10) {
        // Game won!
        setGameOver(true);
        onScoreUpdate(500); // Bonus
        return;
      }

      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setUserSequence([]);
      setLevel(prev => prev + 1);
      
      setTimeout(() => playSimonSequence(newSequence), 1000);
    }
  };

  // Frequency Test Functions
  const startFrequencyGame = () => {
    const target = Math.floor(Math.random() * 800) + 200; // 200-1000 Hz
    setTargetFrequency(target);
    setCurrentFrequency(440);
    setFrequencyGuess(440);
    setFrequencyScore(0);
    setFrequencyRound(1);
    setFrequencyGameOver(false);
  };

  const playTargetFrequency = () => {
    createBeep(targetFrequency, 1);
  };

  const playCurrentFrequency = () => {
    createBeep(frequencyGuess, 0.5);
  };

  const submitFrequencyGuess = () => {
    const difference = Math.abs(targetFrequency - frequencyGuess);
    const accuracy = Math.max(0, 100 - (difference / 10)); // 10Hz = 1% penalty
    const points = Math.floor(accuracy * 10);
    
    setFrequencyScore(prev => prev + points);
    onScoreUpdate(points);

    if (frequencyRound >= 5) {
      setFrequencyGameOver(true);
      if (accuracy > 90) onScoreUpdate(200); // Bonus for high accuracy
    } else {
      // Next round
      setTimeout(() => {
        const target = Math.floor(Math.random() * 800) + 200;
        setTargetFrequency(target);
        setFrequencyGuess(440);
        setFrequencyRound(prev => prev + 1);
      }, 1500);
    }
  };

  // Rhythm Game Functions
  const startRhythmGame = () => {
    const pattern = Array.from({length: 4}, () => Math.random() * 2000 + 500); // 0.5-2.5s intervals
    setRhythmPattern(pattern);
    setUserRhythm([]);
    setRhythmLevel(1);
    setRhythmGameOver(false);
    setTimeout(() => playRhythmPattern(pattern), 500);
  };

  const playRhythmPattern = async (pattern: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < pattern.length; i++) {
      await createBeep(440, 0.2);
      if (i < pattern.length - 1) {
        await new Promise(resolve => setTimeout(resolve, pattern[i]));
      }
    }
    setIsPlaying(false);
    setRhythmStartTime(Date.now());
    setRhythmRecording(true);
  };

  const handleRhythmTap = () => {
    if (!rhythmRecording) return;
    
    const currentTime = Date.now();
    if (userRhythm.length === 0) {
      setUserRhythm([0]);
    } else {
      const lastTap = rhythmStartTime + userRhythm.reduce((sum, gap) => sum + gap, 0);
      const gap = currentTime - lastTap;
      setUserRhythm(prev => [...prev, gap]);
    }

    createBeep(440, 0.2);

    if (userRhythm.length >= rhythmPattern.length - 1) {
      // Check accuracy
      setTimeout(() => {
        checkRhythmAccuracy();
      }, 100);
    }
  };

  const checkRhythmAccuracy = () => {
    setRhythmRecording(false);
    
    let accuracy = 0;
    for (let i = 0; i < Math.min(rhythmPattern.length, userRhythm.length + 1); i++) {
      if (i === 0) continue; // Skip first tap
      const expected = rhythmPattern[i - 1];
      const actual = userRhythm[i - 1] || 0;
      const diff = Math.abs(expected - actual);
      const tapAccuracy = Math.max(0, 100 - (diff / expected) * 100);
      accuracy += tapAccuracy;
    }
    
    accuracy = accuracy / (rhythmPattern.length - 1);
    const points = Math.floor(accuracy * 5);
    onScoreUpdate(points);

    if (rhythmLevel >= 3) {
      setRhythmGameOver(true);
      if (accuracy > 80) onScoreUpdate(300); // Bonus
    } else {
      setTimeout(() => {
        const pattern = Array.from({length: rhythmLevel + 4}, () => Math.random() * 1500 + 300);
        setRhythmPattern(pattern);
        setUserRhythm([]);
        setRhythmLevel(prev => prev + 1);
        playRhythmPattern(pattern);
      }, 2000);
    }
  };

  const gameMenu = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎵</div>
          <h2 className="text-3xl font-bold mb-4">Audio Games Arena</h2>
          <p className="text-muted-foreground text-lg">
            Test your hearing, memory, and rhythm skills with these audio challenges!
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-bold mb-4 text-center">📖 How to Play Audio Games</h3>
          
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-background rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">1</div>
                <div className="text-xs text-muted-foreground">Note: C (261 Hz)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">2</div>
                <div className="text-xs text-muted-foreground">Note: E (329 Hz)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">3</div>
                <div className="text-xs text-muted-foreground">Note: G (392 Hz)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500 mb-1">4</div>
                <div className="text-xs text-muted-foreground">Note: C (523 Hz)</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <strong className="text-primary">🎧 Audio Simon:</strong> Listen to the sound sequence, then repeat it by clicking the numbered buttons in the correct order. Each level adds one more sound!
              </div>
              <div>
                <strong className="text-secondary">🎚️ Frequency Match:</strong> Listen to the target frequency, then adjust the slider to match it. The closer you get, the more points you earn!
              </div>
              <div>
                <strong className="text-accent">🥁 Rhythm Echo:</strong> Listen to the rhythm pattern, then tap the button to recreate the timing. Match the intervals between beats!
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="game-card cursor-pointer group"
            onClick={() => setCurrentGame('sequence')}
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4 bg-primary/20 text-primary glow-effect transition-all duration-300 group-hover:scale-110">
                <Ear className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Audio Simon
              </h3>
              <p className="text-muted-foreground mb-4">
                Remember and repeat sound sequences
              </p>
              <Button className="w-full game-button">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </div>
          </Card>

          <Card 
            className="game-card cursor-pointer group"
            onClick={() => setCurrentGame('frequency')}
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4 bg-secondary/20 text-secondary neon-effect transition-all duration-300 group-hover:scale-110">
                <Volume2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Frequency Match
              </h3>
              <p className="text-muted-foreground mb-4">
                Match the target frequency by ear
              </p>
              <Button className="w-full neon-button">
                <Volume2 className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </div>
          </Card>

          <Card 
            className="game-card cursor-pointer group"
            onClick={() => setCurrentGame('rhythm')}
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4 bg-accent/20 text-accent transition-all duration-300 group-hover:scale-110">
                <Music className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Rhythm Echo
              </h3>
              <p className="text-muted-foreground mb-4">
                Copy the rhythm patterns perfectly
              </p>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Music className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🎧 Audio Game Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Use headphones:</strong> For the best audio experience and accuracy
              </div>
              <div>
                <strong>Find a quiet space:</strong> Background noise can affect your performance
              </div>
              <div>
                <strong>Listen carefully:</strong> Focus and concentration are key to success
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  if (currentGame === 'menu') {
    return gameMenu();
  }

  // Audio Simon Game
  if (currentGame === 'sequence') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-2xl font-bold">Audio Simon</div>
            <div></div>
          </div>
          
          {!gameOver ? (
            <div className="space-y-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Level {level}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {!isUserTurn && !isPlaying && sequence.length === 0 && "Click Start to begin"}
                {isPlaying && "Listen to the sequence..."}
                {isUserTurn && "Repeat the sequence!"}
              </div>
            </div>
          ) : (
            <div className="animate-zoom-in">
              <Badge variant={level >= 10 ? "default" : "destructive"} className="text-xl px-6 py-3">
                {level >= 10 ? "🏆 Perfect Score!" : "💀 Game Over!"}
              </Badge>
              <p className="text-muted-foreground mt-2">
                {level >= 10 ? "You completed all levels!" : `You reached level ${level}`}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
          {frequencies.map((freq, index) => (
            <Button
              key={index}
              className={`aspect-square text-2xl font-bold ${colors[index]} hover:opacity-80 transition-all duration-200 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              onClick={() => handleSimonButton(index)}
              disabled={!isUserTurn || isPlaying}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <div className="text-center space-y-4">
          {sequence.length === 0 && !gameOver && (
            <Button onClick={startSimonGame} className="game-button">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          )}
          
          {gameOver && (
            <Button onClick={startSimonGame} className="game-button">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Frequency Match Game
  if (currentGame === 'frequency') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-2xl font-bold">Frequency Match</div>
            <div></div>
          </div>

          {!frequencyGameOver ? (
            <div className="space-y-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Round {frequencyRound} / 5
              </Badge>
              <div className="text-sm text-muted-foreground">
                Listen to the target frequency and match it with the slider
              </div>
            </div>
          ) : (
            <div className="animate-zoom-in">
              <Badge variant="default" className="text-xl px-6 py-3">
                🎯 Final Score: {frequencyScore}
              </Badge>
              <p className="text-muted-foreground mt-2">
                Great job on the frequency challenge!
              </p>
            </div>
          )}
        </div>

        {!frequencyGameOver ? (
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              <div className="text-center">
                <Button onClick={playTargetFrequency} className="game-button mb-4">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Target Frequency
                </Button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Adjust Frequency: {frequencyGuess}Hz</span>
                  <Button size="sm" onClick={playCurrentFrequency} variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  value={frequencyGuess}
                  onChange={(e) => setFrequencyGuess(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <Button onClick={submitFrequencyGuess} className="w-full game-button">
                Submit Guess
              </Button>
            </div>
          </Card>
        ) : (
          <div className="text-center space-y-4">
            <Button onClick={startFrequencyGame} className="game-button">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        )}

        {!frequencyGameOver && targetFrequency && (
          <div className="text-center">
            <Button onClick={startFrequencyGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Rhythm Echo Game
  if (currentGame === 'rhythm') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setCurrentGame('menu')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-2xl font-bold">Rhythm Echo</div>
            <div></div>
          </div>

          {!rhythmGameOver ? (
            <div className="space-y-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Level {rhythmLevel} / 3
              </Badge>
              <div className="text-sm text-muted-foreground">
                {!rhythmRecording && !isPlaying && rhythmPattern.length === 0 && "Click Start to hear the rhythm"}
                {isPlaying && "Listen to the rhythm pattern..."}
                {rhythmRecording && "Tap the button to copy the rhythm!"}
              </div>
            </div>
          ) : (
            <div className="animate-zoom-in">
              <Badge variant="default" className="text-xl px-6 py-3">
                🎵 Rhythm Master!
              </Badge>
              <p className="text-muted-foreground mt-2">
                You completed all rhythm challenges!
              </p>
            </div>
          )}
        </div>

        <Card className="p-8 text-center mb-6">
          {rhythmRecording ? (
            <Button
              onClick={handleRhythmTap}
              className="w-32 h-32 rounded-full text-2xl font-bold game-button animate-pulse"
            >
              TAP
            </Button>
          ) : (
            <div className="w-32 h-32 mx-auto flex items-center justify-center">
              <Music className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </Card>

        <div className="text-center space-y-4">
          {rhythmPattern.length === 0 && !rhythmGameOver && (
            <Button onClick={startRhythmGame} className="game-button">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          )}
          
          {rhythmGameOver && (
            <Button onClick={startRhythmGame} className="game-button">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};