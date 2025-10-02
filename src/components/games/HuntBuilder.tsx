import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Eye, 
  MapPin, 
  Lightbulb, 
  CheckCircle,
  X,
  Copy
} from 'lucide-react';

interface Hunt {
  id: string;
  title: string;
  description: string;
  levels: HuntLevel[];
  createdAt: Date;
}

interface HuntLevel {
  id: string;
  title: string;
  clue: string;
  answer: string;
  hint?: string;
  location?: string;
}

interface HuntBuilderProps {
  onScoreUpdate: (score: number) => void;
}

export const HuntBuilder = ({ onScoreUpdate }: HuntBuilderProps) => {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [currentHunt, setCurrentHunt] = useState<Hunt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [playingHunt, setPlayingHunt] = useState<Hunt | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Hunt Creation Functions
  const startNewHunt = () => {
    const newHunt: Hunt = {
      id: Date.now().toString(),
      title: '',
      description: '',
      levels: [],
      createdAt: new Date()
    };
    setCurrentHunt(newHunt);
    setIsCreating(true);
  };

  const addLevel = () => {
    if (!currentHunt) return;
    
    const newLevel: HuntLevel = {
      id: Date.now().toString(),
      title: `Level ${currentHunt.levels.length + 1}`,
      clue: '',
      answer: '',
      hint: '',
      location: ''
    };
    
    setCurrentHunt({
      ...currentHunt,
      levels: [...currentHunt.levels, newLevel]
    });
  };

  const updateLevel = (levelId: string, field: keyof HuntLevel, value: string) => {
    if (!currentHunt) return;
    
    setCurrentHunt({
      ...currentHunt,
      levels: currentHunt.levels.map(level => 
        level.id === levelId ? { ...level, [field]: value } : level
      )
    });
  };

  const deleteLevel = (levelId: string) => {
    if (!currentHunt) return;
    
    setCurrentHunt({
      ...currentHunt,
      levels: currentHunt.levels.filter(level => level.id !== levelId)
    });
  };

  const saveHunt = () => {
    if (!currentHunt || !currentHunt.title || currentHunt.levels.length === 0) return;
    
    setHunts(prev => [...prev, currentHunt]);
    setCurrentHunt(null);
    setIsCreating(false);
  };

  const deleteHunt = (huntId: string) => {
    setHunts(prev => prev.filter(hunt => hunt.id !== huntId));
  };

  // Hunt Playing Functions
  const startPlayingHunt = (hunt: Hunt) => {
    setPlayingHunt(hunt);
    setCurrentLevel(0);
    setUserAnswer('');
    setShowHint(false);
    setCompletedLevels([]);
  };

  const checkAnswer = () => {
    if (!playingHunt || !userAnswer.trim()) return;
    
    const level = playingHunt.levels[currentLevel];
    const isCorrect = userAnswer.toLowerCase().trim() === level.answer.toLowerCase().trim();
    
    if (isCorrect) {
      const newCompletedLevels = [...completedLevels, currentLevel];
      setCompletedLevels(newCompletedLevels);
      
      // Score based on level completion and hint usage
      const points = showHint ? 50 : 100;
      onScoreUpdate(points);
      
      if (currentLevel < playingHunt.levels.length - 1) {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          setUserAnswer('');
          setShowHint(false);
        }, 1500);
      } else {
        // Hunt completed!
        setTimeout(() => {
          setPlayingHunt(null);
          onScoreUpdate(500); // Bonus for completing hunt
        }, 2000);
      }
    } else {
      // Wrong answer animation could be added here
    }
  };

  const stopPlaying = () => {
    setPlayingHunt(null);
    setCurrentLevel(0);
    setUserAnswer('');
    setShowHint(false);
    setCompletedLevels([]);
  };

  // Hunt Playing View
  if (playingHunt) {
    const level = playingHunt.levels[currentLevel];
    const progress = ((currentLevel + 1) / playingHunt.levels.length) * 100;
    const isCorrect = userAnswer.toLowerCase().trim() === level.answer.toLowerCase().trim();
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">{playingHunt.title}</h2>
          <p className="text-muted-foreground mb-4">{playingHunt.description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline">
              Level {currentLevel + 1} of {playingHunt.levels.length}
            </Badge>
            <Button variant="outline" size="sm" onClick={stopPlaying}>
              <X className="h-4 w-4 mr-1" />
              Exit Hunt
            </Button>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{level.title}</h3>
            {level.location && (
              <Badge variant="outline" className="mb-4">
                <MapPin className="h-3 w-3 mr-1" />
                {level.location}
              </Badge>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-lg leading-relaxed">{level.clue}</p>
          </div>
          
          {level.hint && (
            <div className="mb-6">
              {!showHint ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHint(true)}
                  className="w-full"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Show Hint (-50% points)
                </Button>
              ) : (
                <div className="p-4 bg-warning/20 border border-warning/50 rounded-lg">
                  <p className="text-sm">{level.hint}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              placeholder="Enter your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className={`text-center ${
                isCorrect ? 'border-success text-success' : ''
              }`}
            />
            
            <Button 
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full game-button"
            >
              {isCorrect ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Correct! 🎉
                </>
              ) : (
                <>
                  Check Answer
                </>
              )}
            </Button>
          </div>
        </Card>

        {currentLevel === playingHunt.levels.length - 1 && isCorrect && (
          <Card className="p-6 text-center animate-zoom-in">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Hunt Completed!</h3>
            <p className="text-muted-foreground">
              Congratulations! You've successfully completed the treasure hunt.
            </p>
          </Card>
        )}
      </div>
    );
  }

  // Hunt Creation View
  if (isCreating && currentHunt) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="relative text-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-3xl -z-10" />
          <div className="relative bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border-2 border-amber-300/50 dark:border-amber-700/50">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Create Your Hunt</h2>
          </div>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-800/50">
          <h3 className="text-lg font-semibold mb-4 text-amber-900 dark:text-amber-100">Hunt Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hunt Title</label>
              <Input
                placeholder="Enter hunt title..."
                value={currentHunt.title}
                onChange={(e) => setCurrentHunt({...currentHunt, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe your hunt..."
                value={currentHunt.description}
                onChange={(e) => setCurrentHunt({...currentHunt, description: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4 mb-6">
          {currentHunt.levels.map((level, index) => (
            <Card key={level.id} className="p-6 bg-white/80 dark:bg-slate-900/80 border-2 border-amber-200/30 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Level {index + 1}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteLevel(level.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Level Title</label>
                  <Input
                    placeholder="Level title..."
                    value={level.title}
                    onChange={(e) => updateLevel(level.id, 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Clue/Puzzle</label>
                  <Textarea
                    placeholder="Write your clue or puzzle..."
                    value={level.clue}
                    onChange={(e) => updateLevel(level.id, 'clue', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Answer</label>
                    <Input
                      placeholder="Correct answer..."
                      value={level.answer}
                      onChange={(e) => updateLevel(level.id, 'answer', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hint (Optional)</label>
                    <Input
                      placeholder="Helpful hint..."
                      value={level.hint}
                      onChange={(e) => updateLevel(level.id, 'hint', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location (Optional)</label>
                    <Input
                      placeholder="Location name..."
                      value={level.location}
                      onChange={(e) => updateLevel(level.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={addLevel} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>
          
          <Button 
            onClick={saveHunt}
            disabled={!currentHunt.title || currentHunt.levels.length === 0}
            className="game-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Hunt
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreating(false);
              setCurrentHunt(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Main Hunt Library View
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative text-center mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-3xl -z-10" />
        <div className="relative bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 border-2 border-amber-300/50 dark:border-amber-700/50 shadow-xl">
          <div className="text-6xl mb-6 animate-bounce">🗺️</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            Treasure Hunt Builder
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Create and play custom treasure hunts with clues, puzzles, and hidden secrets!
          </p>
          
          <Card className="p-6 mb-6 max-w-2xl mx-auto text-left bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-2xl">📖</span> 
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                How to Use Hunt Builder
              </span>
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div><strong className="text-amber-700 dark:text-amber-400">Create:</strong> Click "Create New Hunt" and add your title, description, and levels</div>
              <div><strong className="text-amber-700 dark:text-amber-400">Build Levels:</strong> Each level needs a clue/puzzle and an answer. Add hints and locations for extra guidance</div>
              <div><strong className="text-amber-700 dark:text-amber-400">Play:</strong> Select any saved hunt and solve the puzzles in order</div>
              <div><strong className="text-amber-700 dark:text-amber-400">Score:</strong> Earn 100 points per level (50 if you use a hint)</div>
              <div><strong className="text-amber-700 dark:text-amber-400">Complete:</strong> Finish all levels to get a 500 point bonus!</div>
            </div>
          </Card>
          
          <Button onClick={startNewHunt} className="game-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-all duration-300 hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Create New Hunt
          </Button>
        </div>
      </div>

      {hunts.length === 0 ? (
        <Card className="p-8 text-center bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50 border-2 border-dashed border-amber-300 dark:border-amber-700">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2 text-amber-900 dark:text-amber-100">No Hunts Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first treasure hunt! Add clues, puzzles, and challenges for others to solve.
          </p>
          <Button onClick={startNewHunt} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Hunt
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hunts.map((hunt) => (
            <Card key={hunt.id} className="game-card p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{hunt.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{hunt.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                    {hunt.levels.length} levels
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700">
                    Created {hunt.createdAt.toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => startPlayingHunt(hunt)}
                  className="flex-1 game-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCurrentHunt(hunt);
                    setIsCreating(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteHunt(hunt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Card className="p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-800/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">💡</span>
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              Hunt Creation Tips
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-amber-700 dark:text-amber-400">Make it challenging:</strong> Use riddles, wordplay, or require observation skills
            </div>
            <div>
              <strong className="text-amber-700 dark:text-amber-400">Add variety:</strong> Mix different types of clues - visual, logical, location-based
            </div>
            <div>
              <strong className="text-amber-700 dark:text-amber-400">Test it first:</strong> Make sure all clues are solvable and answers are clear
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};