import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Brain, 
  Target, 
  Zap, 
  Trophy, 
  Star,
  Play,
  Shuffle,
  Timer,
  Award,
  Puzzle,
  Lightbulb
} from 'lucide-react';
import { MemoryGame } from '@/components/games/MemoryGame';
import { QuizGameExpanded } from '@/components/games/QuizGameExpanded';
import { IconMatchGame } from '@/components/games/IconMatchGame';
import { ReactionTimeGame } from '@/components/games/ReactionTimeGame';
import { HuntBuilder } from '@/components/games/HuntBuilder';
import { AudioGames } from '@/components/games/AudioGames';

const Index = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);

  const games = [
    {
      id: 'memory',
      title: 'Memory Master',
      description: 'Test your memory with icon matching',
      icon: Brain,
      color: 'primary',
      component: MemoryGame
    },
    {
      id: 'quiz',
      title: 'Ultimate Quiz',
      description: '100+ shuffled questions across 6 categories',
      icon: Lightbulb,
      color: 'accent',
      component: QuizGameExpanded
    },
    {
      id: 'iconmatch',
      title: 'Icon Matcher',
      description: 'Match icons as fast as you can',
      icon: Zap,
      color: 'warning',
      component: IconMatchGame
    },
    {
      id: 'reaction',
      title: 'Reaction Time',
      description: 'Test your reflexes',
      icon: Timer,
      color: 'info',
      component: ReactionTimeGame
    },
    {
      id: 'hunt',
      title: 'Hunt Builder',
      description: 'Create and play custom treasure hunts',
      icon: Target,
      color: 'warning',
      component: HuntBuilder
    },
    {
      id: 'audio',
      title: 'Audio Games',
      description: 'Audio-based memory and rhythm challenges',
      icon: Gamepad2,
      color: 'secondary',
      component: AudioGames
    }
  ];

  const renderActiveGame = () => {
    const game = games.find(g => g.id === activeGame);
    if (!game) return null;

    const GameComponent = game.component;
    return (
      <div className="animate-zoom-in">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => setActiveGame(null)}
            variant="outline"
            className="text-primary border-primary/50 hover:bg-primary/10"
          >
            ← Back to Games
          </Button>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <game.icon className="h-6 w-6" />
            {game.title}
          </h2>
        </div>
        <GameComponent onScoreUpdate={setPlayerScore} />
      </div>
    );
  };

  if (activeGame) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {renderActiveGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gaming-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="animate-slide-in-game">
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
              🎮 Game Hub
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Challenge yourself with our collection of exciting games and brain-teasing quizzes!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-lg px-4 py-2 animate-bounce-gaming">
                <Trophy className="h-5 w-5 mr-2" />
                Score: {playerScore}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 border-white/30 text-white">
                <Star className="h-5 w-5 mr-2" />
                {games.length} Games Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Game</h2>
          <p className="text-muted-foreground text-lg">Pick a game and start playing instantly!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => {
            const IconComponent = game.icon;
            return (
              <Card 
                key={game.id} 
                className="game-card cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 transition-all duration-300 group-hover:scale-110 ${
                    game.color === 'primary' ? 'bg-primary/20 text-primary glow-effect' :
                    game.color === 'secondary' ? 'bg-secondary/20 text-secondary neon-effect' :
                    game.color === 'accent' ? 'bg-accent/20 text-accent' :
                    game.color === 'warning' ? 'bg-warning/20 text-warning' :
                    'bg-info/20 text-info'
                  }`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  
                  <Button className={`w-full ${
                    game.color === 'primary' ? 'game-button' :
                    game.color === 'secondary' ? 'neon-button' :
                    'bg-accent text-accent-foreground hover:bg-accent/90'
                  }`}>
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-primary/20 text-primary mb-4 group-hover:animate-glow-pulse">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Play</h3>
            <p className="text-muted-foreground">No downloads needed - play directly in your browser</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-secondary/20 text-secondary mb-4 group-hover:animate-neon-pulse">
              <Puzzle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Brain Training</h3>
            <p className="text-muted-foreground">Challenge your mind with puzzles and quizzes</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">Keep track of your scores and achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;