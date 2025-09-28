import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Globe, 
  Palette, 
  Gamepad2, 
  Trophy, 
  Timer, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Star
} from 'lucide-react';

interface QuizGameProps {
  onScoreUpdate: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const quizData: Question[] = [
  // Science Questions
  { id: 1, question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, category: "Science", difficulty: "easy" },
  { id: 2, question: "How many bones are in the human body?", options: ["206", "208", "210", "204"], correct: 0, category: "Science", difficulty: "medium" },
  { id: 3, question: "What is the speed of light?", options: ["300,000 km/s", "299,792,458 m/s", "186,000 mi/s", "All of the above"], correct: 3, category: "Science", difficulty: "hard" },
  
  // Geography Questions
  { id: 4, question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, category: "Geography", difficulty: "medium" },
  { id: 5, question: "Which river is the longest in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correct: 1, category: "Geography", difficulty: "easy" },
  { id: 6, question: "How many time zones does Russia span?", options: ["9", "11", "13", "15"], correct: 1, category: "Geography", difficulty: "hard" },
  
  // Technology Questions
  { id: 7, question: "What does 'HTML' stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "None of the above"], correct: 0, category: "Technology", difficulty: "easy" },
  { id: 8, question: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 9, question: "What year was the first iPhone released?", options: ["2006", "2007", "2008", "2009"], correct: 1, category: "Technology", difficulty: "medium" },
  
  // Entertainment Questions
  { id: 10, question: "Which movie won the Oscar for Best Picture in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], correct: 2, category: "Entertainment", difficulty: "medium" },
  { id: 11, question: "What is the highest-grossing film of all time?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 12, question: "Who composed 'The Four Seasons'?", options: ["Mozart", "Beethoven", "Vivaldi", "Bach"], correct: 2, category: "Entertainment", difficulty: "medium" },
  
  // History Questions
  { id: 13, question: "In what year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: 1, category: "History", difficulty: "easy" },
  { id: 14, question: "Who was the first person to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"], correct: 1, category: "History", difficulty: "easy" },
  { id: 15, question: "Which ancient wonder of the world was located in Alexandria?", options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"], correct: 1, category: "History", difficulty: "hard" },
  
  // Sports Questions
  { id: 16, question: "How many players are on a basketball team on the court?", options: ["4", "5", "6", "7"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 17, question: "Which country has won the most FIFA World Cups?", options: ["Germany", "Argentina", "Brazil", "Italy"], correct: 2, category: "Sports", difficulty: "medium" },
  { id: 18, question: "What is the maximum score possible in ten-pin bowling?", options: ["250", "280", "300", "350"], correct: 2, category: "Sports", difficulty: "medium" },
];

const categories = [
  { name: "Science", icon: Brain, color: "primary" },
  { name: "Geography", icon: Globe, color: "secondary" },
  { name: "Technology", icon: Gamepad2, color: "accent" },
  { name: "Entertainment", icon: Palette, color: "warning" },
  { name: "History", icon: Trophy, color: "info" },
  { name: "Sports", icon: Star, color: "success" }
];

export const QuizGame = ({ onScoreUpdate }: QuizGameProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameFinished, setGameFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Timer effect
  useEffect(() => {
    if (selectedCategory && !showResult && !gameFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(null); // Auto-submit when time runs out
    }
  }, [timeLeft, selectedCategory, showResult, gameFinished]);

  const startQuiz = (category: string) => {
    const categoryQuestions = quizData.filter(q => q.category === category);
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    
    setSelectedCategory(category);
    setCurrentQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setGameFinished(false);
    setCorrectAnswers(0);
  };

  const handleAnswer = (answerIndex: number | null) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      const points = currentQuestion.difficulty === 'easy' ? 10 : 
                   currentQuestion.difficulty === 'medium' ? 20 : 30;
      const timeBonus = Math.floor(timeLeft / 3); // Bonus points for quick answers
      const totalPoints = points + timeBonus;
      
      setScore(prev => {
        const newScore = prev + totalPoints;
        onScoreUpdate(newScore);
        return newScore;
      });
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setGameFinished(false);
    setCorrectAnswers(0);
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-3xl font-bold mb-4">Mega Quiz Challenge</h2>
          <p className="text-muted-foreground text-lg">
            Test your knowledge across multiple categories!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const categoryQuestions = quizData.filter(q => q.category === category.name);
            
            return (
              <Card
                key={category.name}
                className="game-card cursor-pointer group"
                onClick={() => startQuiz(category.name)}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 transition-all duration-300 group-hover:scale-110 ${
                    category.color === 'primary' ? 'bg-primary/20 text-primary glow-effect' :
                    category.color === 'secondary' ? 'bg-secondary/20 text-secondary neon-effect' :
                    category.color === 'accent' ? 'bg-accent/20 text-accent' :
                    category.color === 'warning' ? 'bg-warning/20 text-warning' :
                    category.color === 'info' ? 'bg-info/20 text-info' :
                    'bg-success/20 text-success'
                  }`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {categoryQuestions.length} questions
                  </p>
                  
                  <Button className={`w-full ${
                    category.color === 'primary' ? 'game-button' :
                    category.color === 'secondary' ? 'neon-button' :
                    'bg-accent text-accent-foreground hover:bg-accent/90'
                  }`}>
                    Start Quiz
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const percentage = Math.round((correctAnswers / currentQuestions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-zoom-in">
          <div className="text-6xl mb-6">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '💪'}
          </div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="bg-primary/20 border border-primary/50 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold text-primary mb-2">Final Score: {score}</div>
            <p className="text-muted-foreground">
              You got {correctAnswers} out of {currentQuestions.length} questions correct ({percentage}%)
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => startQuiz(selectedCategory!)} className="game-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={resetQuiz}>
              Choose New Category
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </Badge>
          <Badge variant="outline" className={timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}>
            <Timer className="h-4 w-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Score */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="h-4 w-4 mr-2" />
          Score: {score}
        </Badge>
      </div>

      {/* Question */}
      <Card className="mb-6 p-6">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            {currentQuestion.category} - {currentQuestion.difficulty}
          </Badge>
          <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
        </div>
      </Card>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left transition-all duration-300 hover:scale-105";
          
          if (showResult) {
            if (index === currentQuestion.correct) {
              buttonClass += " bg-success/20 border-success text-success animate-glow-pulse";
            } else if (index === selectedAnswer && index !== currentQuestion.correct) {
              buttonClass += " bg-destructive/20 border-destructive text-destructive";
            } else {
              buttonClass += " opacity-50";
            }
          } else {
            buttonClass += " hover:bg-primary/10 hover:border-primary/50";
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonClass}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {showResult && index === currentQuestion.correct && (
                  <CheckCircle className="h-5 w-5" />
                )}
                {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Result Message */}
      {showResult && (
        <div className="text-center animate-zoom-in">
          <Badge 
            variant={selectedAnswer === currentQuestion.correct ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {selectedAnswer === currentQuestion.correct ? '✅ Correct!' : '❌ Incorrect!'}
          </Badge>
        </div>
      )}

      <div className="text-center mt-8">
        <Button variant="outline" onClick={resetQuiz}>
          ← Back to Categories
        </Button>
      </div>
    </div>
  );
};