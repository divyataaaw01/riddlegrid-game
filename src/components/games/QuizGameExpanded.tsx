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
  Star,
  Music,
  BookOpen,
  Zap
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

// Expanded quiz database with 100+ questions
const quizDatabase: Question[] = [
  // Science Questions (20 questions)
  { id: 1, question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, category: "Science", difficulty: "easy" },
  { id: 2, question: "How many bones are in the human body?", options: ["206", "208", "210", "204"], correct: 0, category: "Science", difficulty: "medium" },
  { id: 3, question: "What is the speed of light?", options: ["300,000 km/s", "299,792,458 m/s", "186,000 mi/s", "All of the above"], correct: 3, category: "Science", difficulty: "hard" },
  { id: 4, question: "What gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2, category: "Science", difficulty: "easy" },
  { id: 5, question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2, category: "Science", difficulty: "easy" },
  { id: 6, question: "How many chambers does a human heart have?", options: ["2", "3", "4", "5"], correct: 2, category: "Science", difficulty: "medium" },
  { id: 7, question: "What is the smallest unit of matter?", options: ["Molecule", "Atom", "Proton", "Electron"], correct: 1, category: "Science", difficulty: "medium" },
  { id: 8, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1, category: "Science", difficulty: "easy" },
  { id: 9, question: "What is the chemical formula for water?", options: ["H2O", "CO2", "NaCl", "O2"], correct: 0, category: "Science", difficulty: "easy" },
  { id: 10, question: "What type of animal is a dolphin?", options: ["Fish", "Mammal", "Reptile", "Amphibian"], correct: 1, category: "Science", difficulty: "medium" },
  { id: 11, question: "What is the boiling point of water at sea level?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1, category: "Science", difficulty: "easy" },
  { id: 12, question: "Which blood type is known as the universal donor?", options: ["A", "B", "AB", "O"], correct: 3, category: "Science", difficulty: "medium" },
  { id: 13, question: "What is the largest organ in the human body?", options: ["Brain", "Liver", "Skin", "Heart"], correct: 2, category: "Science", difficulty: "medium" },
  { id: 14, question: "How many teeth does an adult human have?", options: ["28", "30", "32", "34"], correct: 2, category: "Science", difficulty: "medium" },
  { id: 15, question: "What is the study of earthquakes called?", options: ["Geology", "Seismology", "Meteorology", "Astronomy"], correct: 1, category: "Science", difficulty: "hard" },
  { id: 16, question: "Which gas is most abundant in the sun?", options: ["Oxygen", "Helium", "Hydrogen", "Carbon"], correct: 2, category: "Science", difficulty: "hard" },
  { id: 17, question: "What is the pH level of pure water?", options: ["6", "7", "8", "9"], correct: 1, category: "Science", difficulty: "medium" },
  { id: 18, question: "How many chromosomes do humans have?", options: ["44", "46", "48", "50"], correct: 1, category: "Science", difficulty: "hard" },
  { id: 19, question: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Leopard", "Tiger"], correct: 1, category: "Science", difficulty: "easy" },
  { id: 20, question: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"], correct: 2, category: "Science", difficulty: "medium" },

  // Geography Questions (20 questions)
  { id: 21, question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, category: "Geography", difficulty: "medium" },
  { id: 22, question: "Which river is the longest in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correct: 1, category: "Geography", difficulty: "easy" },
  { id: 23, question: "How many time zones does Russia span?", options: ["9", "11", "13", "15"], correct: 1, category: "Geography", difficulty: "hard" },
  { id: 24, question: "What is the smallest country in the world?", options: ["Monaco", "Nauru", "Vatican City", "San Marino"], correct: 2, category: "Geography", difficulty: "medium" },
  { id: 25, question: "Which continent has the most countries?", options: ["Asia", "Europe", "Africa", "South America"], correct: 2, category: "Geography", difficulty: "medium" },
  { id: 26, question: "What is the highest mountain in the world?", options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"], correct: 1, category: "Geography", difficulty: "easy" },
  { id: 27, question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3, category: "Geography", difficulty: "easy" },
  { id: 28, question: "What is the capital of Brazil?", options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], correct: 2, category: "Geography", difficulty: "medium" },
  { id: 29, question: "Which desert is the largest in the world?", options: ["Sahara", "Gobi", "Antarctica", "Arabian"], correct: 2, category: "Geography", difficulty: "hard" },
  { id: 30, question: "What is the deepest point on Earth?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Philippine Trench"], correct: 0, category: "Geography", difficulty: "medium" },
  { id: 31, question: "How many Great Lakes are there?", options: ["4", "5", "6", "7"], correct: 1, category: "Geography", difficulty: "easy" },
  { id: 32, question: "Which country has the most natural lakes?", options: ["Russia", "Canada", "Finland", "Sweden"], correct: 1, category: "Geography", difficulty: "hard" },
  { id: 33, question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correct: 3, category: "Geography", difficulty: "medium" },
  { id: 34, question: "Which African country was never colonized?", options: ["Libya", "Ethiopia", "Morocco", "Egypt"], correct: 1, category: "Geography", difficulty: "hard" },
  { id: 35, question: "What is the largest island in the world?", options: ["Australia", "Greenland", "New Guinea", "Borneo"], correct: 1, category: "Geography", difficulty: "medium" },
  { id: 36, question: "Which strait separates Europe and Africa?", options: ["Bosphorus", "Gibraltar", "Hormuz", "Malacca"], correct: 1, category: "Geography", difficulty: "medium" },
  { id: 37, question: "What is the longest river in Europe?", options: ["Danube", "Rhine", "Volga", "Thames"], correct: 2, category: "Geography", difficulty: "hard" },
  { id: 38, question: "Which city is known as the Pearl of the Orient?", options: ["Shanghai", "Hong Kong", "Manila", "Singapore"], correct: 2, category: "Geography", difficulty: "hard" },
  { id: 39, question: "How many U.S. states border Mexico?", options: ["3", "4", "5", "6"], correct: 1, category: "Geography", difficulty: "medium" },
  { id: 40, question: "What is the driest place on Earth?", options: ["Death Valley", "Sahara Desert", "Atacama Desert", "Gobi Desert"], correct: 2, category: "Geography", difficulty: "hard" },

  // Technology Questions (20 questions)
  { id: 41, question: "What does 'HTML' stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "None of the above"], correct: 0, category: "Technology", difficulty: "easy" },
  { id: 42, question: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 43, question: "What year was the first iPhone released?", options: ["2006", "2007", "2008", "2009"], correct: 1, category: "Technology", difficulty: "medium" },
  { id: 44, question: "What does 'CPU' stand for?", options: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 45, question: "Which company developed the Java programming language?", options: ["Microsoft", "Apple", "Sun Microsystems", "Google"], correct: 2, category: "Technology", difficulty: "medium" },
  { id: 46, question: "What does 'AI' stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Automatic Intelligence"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 47, question: "Which social media platform was founded first?", options: ["Facebook", "Twitter", "MySpace", "LinkedIn"], correct: 2, category: "Technology", difficulty: "medium" },
  { id: 48, question: "What is the maximum length of a Tweet on Twitter/X?", options: ["140 characters", "280 characters", "320 characters", "500 characters"], correct: 1, category: "Technology", difficulty: "medium" },
  { id: 49, question: "Which programming language is known as the 'mother of all languages'?", options: ["C", "FORTRAN", "COBOL", "Assembly"], correct: 0, category: "Technology", difficulty: "hard" },
  { id: 50, question: "What does 'WWW' stand for?", options: ["World Wide Web", "World Wide Web", "Worldwide Web", "Web Wide World"], correct: 0, category: "Technology", difficulty: "easy" },
  { id: 51, question: "Which company owns YouTube?", options: ["Microsoft", "Google", "Facebook", "Amazon"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 52, question: "What is the most popular web browser?", options: ["Safari", "Firefox", "Chrome", "Edge"], correct: 2, category: "Technology", difficulty: "easy" },
  { id: 53, question: "What does 'USB' stand for?", options: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "United System Bus"], correct: 0, category: "Technology", difficulty: "medium" },
  { id: 54, question: "Which company developed the Android operating system?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2, category: "Technology", difficulty: "easy" },
  { id: 55, question: "What is the binary equivalent of decimal 10?", options: ["1010", "1100", "1001", "1011"], correct: 0, category: "Technology", difficulty: "hard" },
  { id: 56, question: "Which protocol is used for secure web browsing?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], correct: 1, category: "Technology", difficulty: "medium" },
  { id: 57, question: "What does 'RAM' stand for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Access Memory", "Read Active Memory"], correct: 1, category: "Technology", difficulty: "easy" },
  { id: 58, question: "Which company created the first personal computer?", options: ["IBM", "Apple", "Altair", "Commodore"], correct: 2, category: "Technology", difficulty: "hard" },
  { id: 59, question: "What is the most used programming language in 2024?", options: ["Python", "JavaScript", "Java", "C++"], correct: 1, category: "Technology", difficulty: "medium" },
  { id: 60, question: "Which technology enables contactless payments?", options: ["Bluetooth", "WiFi", "NFC", "GPS"], correct: 2, category: "Technology", difficulty: "medium" },

  // Entertainment Questions (20 questions)
  { id: 61, question: "Which movie won the Oscar for Best Picture in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], correct: 2, category: "Entertainment", difficulty: "medium" },
  { id: 62, question: "What is the highest-grossing film of all time?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 63, question: "Who composed 'The Four Seasons'?", options: ["Mozart", "Beethoven", "Vivaldi", "Bach"], correct: 2, category: "Entertainment", difficulty: "medium" },
  { id: 64, question: "Which TV series has the most Emmy Awards?", options: ["Game of Thrones", "The West Wing", "Saturday Night Live", "Frasier"], correct: 2, category: "Entertainment", difficulty: "hard" },
  { id: 65, question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], correct: 2, category: "Entertainment", difficulty: "easy" },
  { id: 66, question: "Which Disney movie features the song 'Let It Go'?", options: ["Moana", "Frozen", "Tangled", "Brave"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 67, question: "Who directed the movie 'Pulp Fiction'?", options: ["Martin Scorsese", "Quentin Tarantino", "Christopher Nolan", "Steven Spielberg"], correct: 1, category: "Entertainment", difficulty: "medium" },
  { id: 68, question: "Which band released the album 'Abbey Road'?", options: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "The Who"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 69, question: "What is the longest-running Broadway show?", options: ["The Lion King", "Chicago", "The Phantom of the Opera", "Cats"], correct: 2, category: "Entertainment", difficulty: "hard" },
  { id: 70, question: "Who wrote the Harry Potter series?", options: ["J.R.R. Tolkien", "C.S. Lewis", "J.K. Rowling", "George R.R. Martin"], correct: 2, category: "Entertainment", difficulty: "easy" },
  { id: 71, question: "Which streaming service produced 'Stranger Things'?", options: ["Hulu", "Netflix", "Amazon Prime", "Disney+"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 72, question: "Who played Iron Man in the Marvel Cinematic Universe?", options: ["Chris Evans", "Robert Downey Jr.", "Mark Ruffalo", "Chris Hemsworth"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 73, question: "Which video game console was released first?", options: ["PlayStation", "Xbox", "Nintendo 64", "Sega Saturn"], correct: 3, category: "Entertainment", difficulty: "hard" },
  { id: 74, question: "What is the best-selling video game of all time?", options: ["Tetris", "Minecraft", "Grand Theft Auto V", "Super Mario Bros."], correct: 1, category: "Entertainment", difficulty: "medium" },
  { id: 75, question: "Who composed the music for 'Star Wars'?", options: ["Hans Zimmer", "John Williams", "Danny Elfman", "James Horner"], correct: 1, category: "Entertainment", difficulty: "medium" },
  { id: 76, question: "Which superhero is known as the 'Man of Steel'?", options: ["Batman", "Superman", "Iron Man", "Captain America"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 77, question: "What is the highest-rated TV series on IMDb?", options: ["Breaking Bad", "Game of Thrones", "The Sopranos", "Planet Earth II"], correct: 3, category: "Entertainment", difficulty: "hard" },
  { id: 78, question: "Which movie franchise has the most sequels?", options: ["Fast & Furious", "James Bond", "Star Wars", "Marvel Cinematic Universe"], correct: 1, category: "Entertainment", difficulty: "medium" },
  { id: 79, question: "Who is the lead singer of Queen?", options: ["David Bowie", "Freddie Mercury", "Elton John", "Rod Stewart"], correct: 1, category: "Entertainment", difficulty: "easy" },
  { id: 80, question: "Which animated movie won the first Academy Award for Best Animated Feature?", options: ["Monsters, Inc.", "Shrek", "Jimmy Neutron", "Ice Age"], correct: 1, category: "Entertainment", difficulty: "hard" },

  // History Questions (20 questions)
  { id: 81, question: "In what year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: 1, category: "History", difficulty: "easy" },
  { id: 82, question: "Who was the first person to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"], correct: 1, category: "History", difficulty: "easy" },
  { id: 83, question: "Which ancient wonder of the world was located in Alexandria?", options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"], correct: 1, category: "History", difficulty: "hard" },
  { id: 84, question: "When did the Berlin Wall fall?", options: ["1987", "1988", "1989", "1990"], correct: 2, category: "History", difficulty: "medium" },
  { id: 85, question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: 2, category: "History", difficulty: "easy" },
  { id: 86, question: "Which empire was ruled by Julius Caesar?", options: ["Greek", "Roman", "Egyptian", "Persian"], correct: 1, category: "History", difficulty: "easy" },
  { id: 87, question: "When did the Titanic sink?", options: ["1910", "1911", "1912", "1913"], correct: 2, category: "History", difficulty: "medium" },
  { id: 88, question: "Who painted the ceiling of the Sistine Chapel?", options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"], correct: 2, category: "History", difficulty: "medium" },
  { id: 89, question: "Which war was fought between the North and South in America?", options: ["Revolutionary War", "War of 1812", "Civil War", "Spanish-American War"], correct: 2, category: "History", difficulty: "easy" },
  { id: 90, question: "Who discovered America in 1492?", options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Marco Polo"], correct: 1, category: "History", difficulty: "easy" },
  { id: 91, question: "Which ancient civilization built Machu Picchu?", options: ["Aztecs", "Mayans", "Incas", "Olmecs"], correct: 2, category: "History", difficulty: "medium" },
  { id: 92, question: "When did the French Revolution begin?", options: ["1789", "1790", "1791", "1792"], correct: 0, category: "History", difficulty: "medium" },
  { id: 93, question: "Who was known as the 'Iron Lady'?", options: ["Queen Elizabeth II", "Margaret Thatcher", "Golda Meir", "Indira Gandhi"], correct: 1, category: "History", difficulty: "medium" },
  { id: 94, question: "Which country gifted the Statue of Liberty to the USA?", options: ["Britain", "Spain", "France", "Italy"], correct: 2, category: "History", difficulty: "easy" },
  { id: 95, question: "When did World War I begin?", options: ["1914", "1915", "1916", "1917"], correct: 0, category: "History", difficulty: "medium" },
  { id: 96, question: "Who wrote the Communist Manifesto?", options: ["Vladimir Lenin", "Karl Marx", "Joseph Stalin", "Leon Trotsky"], correct: 1, category: "History", difficulty: "hard" },
  { id: 97, question: "Which dynasty ruled China for over 400 years?", options: ["Ming", "Qing", "Tang", "Song"], correct: 1, category: "History", difficulty: "hard" },
  { id: 98, question: "When did the United Nations form?", options: ["1944", "1945", "1946", "1947"], correct: 1, category: "History", difficulty: "medium" },
  { id: 99, question: "Who was the last Pharaoh of Egypt?", options: ["Cleopatra VII", "Tutankhamun", "Ramesses II", "Akhenaten"], correct: 0, category: "History", difficulty: "hard" },
  { id: 100, question: "Which event triggered World War I?", options: ["Invasion of Poland", "Pearl Harbor", "Assassination of Archduke Franz Ferdinand", "Sinking of Lusitania"], correct: 2, category: "History", difficulty: "hard" },

  // Sports Questions (20 questions)
  { id: 101, question: "How many players are on a basketball team on the court?", options: ["4", "5", "6", "7"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 102, question: "Which country has won the most FIFA World Cups?", options: ["Germany", "Argentina", "Brazil", "Italy"], correct: 2, category: "Sports", difficulty: "medium" },
  { id: 103, question: "What is the maximum score possible in ten-pin bowling?", options: ["250", "280", "300", "350"], correct: 2, category: "Sports", difficulty: "medium" },
  { id: 104, question: "How long is a marathon?", options: ["24.2 miles", "25.2 miles", "26.2 miles", "27.2 miles"], correct: 2, category: "Sports", difficulty: "medium" },
  { id: 105, question: "Which sport is known as 'the beautiful game'?", options: ["Basketball", "Soccer/Football", "Tennis", "Baseball"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 106, question: "How many holes are on a standard golf course?", options: ["16", "17", "18", "19"], correct: 2, category: "Sports", difficulty: "easy" },
  { id: 107, question: "Which tennis tournament is played on clay courts?", options: ["Wimbledon", "US Open", "French Open", "Australian Open"], correct: 2, category: "Sports", difficulty: "medium" },
  { id: 108, question: "What is the maximum number of players on a soccer field per team?", options: ["10", "11", "12", "13"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 109, question: "Which country hosted the 2016 Summer Olympics?", options: ["China", "Brazil", "UK", "Russia"], correct: 1, category: "Sports", difficulty: "medium" },
  { id: 110, question: "What does NBA stand for?", options: ["National Basketball Association", "North Basketball Association", "National Ball Association", "New Basketball Association"], correct: 0, category: "Sports", difficulty: "easy" },
  { id: 111, question: "Which swimmer has won the most Olympic gold medals?", options: ["Mark Spitz", "Michael Phelps", "Ryan Lochte", "Caeleb Dressel"], correct: 1, category: "Sports", difficulty: "medium" },
  { id: 112, question: "How many points is a touchdown worth in American football?", options: ["5", "6", "7", "8"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 113, question: "Which sport uses terms like 'love', 'deuce', and 'advantage'?", options: ["Badminton", "Tennis", "Squash", "Table Tennis"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 114, question: "What is the highest possible break in snooker?", options: ["147", "155", "167", "180"], correct: 0, category: "Sports", difficulty: "hard" },
  { id: 115, question: "Which Formula 1 driver has won the most championships?", options: ["Ayrton Senna", "Michael Schumacher", "Lewis Hamilton", "Sebastian Vettel"], correct: 1, category: "Sports", difficulty: "hard" },
  { id: 116, question: "How many innings are in a standard baseball game?", options: ["7", "8", "9", "10"], correct: 2, category: "Sports", difficulty: "easy" },
  { id: 117, question: "Which country invented rugby?", options: ["Australia", "New Zealand", "South Africa", "England"], correct: 3, category: "Sports", difficulty: "medium" },
  { id: 118, question: "What is the diameter of a basketball hoop?", options: ["16 inches", "17 inches", "18 inches", "19 inches"], correct: 2, category: "Sports", difficulty: "hard" },
  { id: 119, question: "Which sport is Tiger Woods famous for?", options: ["Tennis", "Golf", "Baseball", "Swimming"], correct: 1, category: "Sports", difficulty: "easy" },
  { id: 120, question: "How many periods are in a hockey game?", options: ["2", "3", "4", "5"], correct: 1, category: "Sports", difficulty: "medium" },
];

const categories = [
  { name: "Science", icon: Brain, color: "primary" },
  { name: "Geography", icon: Globe, color: "secondary" },
  { name: "Technology", icon: Gamepad2, color: "accent" },
  { name: "Entertainment", icon: Palette, color: "warning" },
  { name: "History", icon: BookOpen, color: "info" },
  { name: "Sports", icon: Star, color: "success" }
];

export const QuizGameExpanded = ({ onScoreUpdate }: QuizGameProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameFinished, setGameFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

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
    let categoryQuestions = quizDatabase.filter(q => q.category === category);
    
    if (difficulty !== 'all') {
      categoryQuestions = categoryQuestions.filter(q => q.difficulty === difficulty);
    }
    
    // Shuffle and pick 10 random questions
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 10);
    
    setSelectedCategory(category);
    setCurrentQuestions(selectedQuestions);
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
          <h2 className="text-3xl font-bold mb-4">Ultimate Quiz Challenge</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Test your knowledge with 10 random questions from our database of 100+!
          </p>
          
          {/* Difficulty Selection */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-4">Choose difficulty level:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className="capitalize"
                >
                  {diff === 'all' ? 'Mixed' : diff}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            let categoryQuestions = quizDatabase.filter(q => q.category === category.name);
            if (difficulty !== 'all') {
              categoryQuestions = categoryQuestions.filter(q => q.difficulty === difficulty);
            }
            
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
                    {categoryQuestions.length} questions available
                  </p>
                  
                  <Button className={`w-full ${
                    category.color === 'primary' ? 'game-button' :
                    category.color === 'secondary' ? 'neon-button' :
                    'bg-accent text-accent-foreground hover:bg-accent/90'
                  }`}>
                    Start Quiz (10 random)
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