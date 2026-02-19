import { QuestionPackage } from './types';

export const questionPackage: QuestionPackage = {
  round1: [
    {
      name: 'Startups',
      questions: [
        { id: 'r1-t1-100', topic: 'Startups', value: 100, text: 'Which company was founded in a garage in Palo Alto in 1939?', answer: 'HP', type: 'regular' },
        { id: 'r1-t1-200', topic: 'Startups', value: 200, text: 'What does MVP stand for in startup terminology?', answer: 'Minimum Viable Product', type: 'regular' },
        { id: 'r1-t1-300', topic: 'Startups', value: 300, text: 'Which startup accelerator program was founded by Paul Graham?', answer: 'Y Combinator', type: 'cat' },
        { id: 'r1-t1-400', topic: 'Startups', value: 400, text: 'What is the term for a startup valued at over $1 billion?', answer: 'Unicorn', type: 'regular' },
        { id: 'r1-t1-500', topic: 'Startups', value: 500, text: 'Which payment company was founded by Peter Thiel and Elon Musk?', answer: 'PayPal', type: 'regular' },
      ],
    },
    {
      name: 'Programming Languages',
      questions: [
        { id: 'r1-t2-100', topic: 'Programming Languages', value: 100, text: 'Which language is known for its use of curly braces and semicolons?', answer: 'C', type: 'regular' },
        { id: 'r1-t2-200', topic: 'Programming Languages', value: 200, text: 'What does HTML stand for?', answer: 'HyperText Markup Language', type: 'regular' },
        { id: 'r1-t2-300', topic: 'Programming Languages', value: 300, text: 'Which language uses significant whitespace for code blocks?', answer: 'Python', type: 'regular' },
        { id: 'r1-t2-400', topic: 'Programming Languages', value: 400, text: 'What programming language was created by James Gosling at Sun Microsystems?', answer: 'Java', type: 'auction' },
        { id: 'r1-t2-500', topic: 'Programming Languages', value: 500, text: 'Which functional programming language is named after a mathematician?', answer: 'Haskell', type: 'regular' },
      ],
    },
    {
      name: 'Memes',
      questions: [
        { id: 'r1-t3-100', topic: 'Memes', value: 100, text: 'What animal is featured in the "Doge" meme?', answer: 'Shiba Inu', type: 'regular' },
        { id: 'r1-t3-200', topic: 'Memes', value: 200, text: 'Which meme features a green frog?', answer: 'Pepe', type: 'regular' },
        { id: 'r1-t3-300', topic: 'Memes', value: 300, text: 'What is the name of the distracted boyfriend meme girl?', answer: 'Woman in red', type: 'regular' },
        { id: 'r1-t3-400', topic: 'Memes', value: 400, text: 'Which meme involves a muscular dog?', answer: 'Swole Doge', type: 'regular' },
        { id: 'r1-t3-500', topic: 'Memes', value: 500, text: 'What year did the "Rickroll" meme become popular?', answer: '2007', type: 'cat' },
      ],
    },
    {
      name: 'Gods of Ancient Egypt',
      questions: [
        { id: 'r1-t4-100', topic: 'Gods of Ancient Egypt', value: 100, text: 'Who is the Egyptian god of the sun?', answer: 'Ra', type: 'regular' },
        { id: 'r1-t4-200', topic: 'Gods of Ancient Egypt', value: 200, text: 'Which Egyptian god has the head of a jackal?', answer: 'Anubis', type: 'regular' },
        { id: 'r1-t4-300', topic: 'Gods of Ancient Egypt', value: 300, text: 'Who is the Egyptian goddess of magic?', answer: 'Isis', type: 'regular' },
        { id: 'r1-t4-400', topic: 'Gods of Ancient Egypt', value: 400, text: 'Which god was associated with the underworld and resurrection?', answer: 'Osiris', type: 'regular' },
        { id: 'r1-t4-500', topic: 'Gods of Ancient Egypt', value: 500, text: 'What animal head does the god Thoth have?', answer: 'Ibis', type: 'regular' },
      ],
    },
    {
      name: 'Artists',
      questions: [
        { id: 'r1-t5-100', topic: 'Artists', value: 100, text: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci', type: 'regular' },
        { id: 'r1-t5-200', topic: 'Artists', value: 200, text: 'Which artist cut off his own ear?', answer: 'Van Gogh', type: 'regular' },
        { id: 'r1-t5-300', topic: 'Artists', value: 300, text: 'Who painted the ceiling of the Sistine Chapel?', answer: 'Michelangelo', type: 'regular' },
        { id: 'r1-t5-400', topic: 'Artists', value: 400, text: 'Which Spanish artist is known for cubism?', answer: 'Picasso', type: 'regular' },
        { id: 'r1-t5-500', topic: 'Artists', value: 500, text: 'Who painted "The Starry Night"?', answer: 'Van Gogh', type: 'auction' },
      ],
    },
    {
      name: 'Mathematics',
      questions: [
        { id: 'r1-t6-100', topic: 'Mathematics', value: 100, text: 'What is 7 times 8?', answer: '56', type: 'regular' },
        { id: 'r1-t6-200', topic: 'Mathematics', value: 200, text: 'What is the value of pi to two decimal places?', answer: '3.14', type: 'regular' },
        { id: 'r1-t6-300', topic: 'Mathematics', value: 300, text: 'What is the square root of 144?', answer: '12', type: 'regular' },
        { id: 'r1-t6-400', topic: 'Mathematics', value: 400, text: 'What is the sum of angles in a triangle?', answer: '180', type: 'regular' },
        { id: 'r1-t6-500', topic: 'Mathematics', value: 500, text: 'What is the derivative of x squared?', answer: '2x', type: 'regular' },
      ],
    },
  ],
  round2: [
    {
      name: 'Space Exploration',
      questions: [
        { id: 'r2-t1-200', topic: 'Space Exploration', value: 200, text: 'Which planet is known as the Red Planet?', answer: 'Mars', type: 'regular' },
        { id: 'r2-t1-400', topic: 'Space Exploration', value: 400, text: 'Who was the first human in space?', answer: 'Yuri Gagarin', type: 'regular' },
        { id: 'r2-t1-600', topic: 'Space Exploration', value: 600, text: 'What is the name of NASA\'s most famous space telescope?', answer: 'Hubble', type: 'cat' },
        { id: 'r2-t1-800', topic: 'Space Exploration', value: 800, text: 'Which planet has the most moons?', answer: 'Saturn', type: 'regular' },
        { id: 'r2-t1-1000', topic: 'Space Exploration', value: 1000, text: 'What is the closest star to Earth besides the Sun?', answer: 'Proxima Centauri', type: 'regular' },
      ],
    },
    {
      name: 'Movies',
      questions: [
        { id: 'r2-t2-200', topic: 'Movies', value: 200, text: 'Who directed "Jurassic Park"?', answer: 'Steven Spielberg', type: 'regular' },
        { id: 'r2-t2-400', topic: 'Movies', value: 400, text: 'What year was the first "Star Wars" movie released?', answer: '1977', type: 'regular' },
        { id: 'r2-t2-600', topic: 'Movies', value: 600, text: 'Which movie won the Oscar for Best Picture in 2020?', answer: 'Parasite', type: 'regular' },
        { id: 'r2-t2-800', topic: 'Movies', value: 800, text: 'Who played Jack in "Titanic"?', answer: 'Leonardo DiCaprio', type: 'auction' },
        { id: 'r2-t2-1000', topic: 'Movies', value: 1000, text: 'What is the highest-grossing film of all time?', answer: 'Avatar', type: 'regular' },
      ],
    },
    {
      name: 'History',
      questions: [
        { id: 'r2-t3-200', topic: 'History', value: 200, text: 'In which year did World War II end?', answer: '1945', type: 'regular' },
        { id: 'r2-t3-400', topic: 'History', value: 400, text: 'Who was the first President of the United States?', answer: 'George Washington', type: 'regular' },
        { id: 'r2-t3-600', topic: 'History', value: 600, text: 'What ancient wonder is located in Egypt?', answer: 'Pyramids', type: 'regular' },
        { id: 'r2-t3-800', topic: 'History', value: 800, text: 'Which empire was ruled by Julius Caesar?', answer: 'Roman Empire', type: 'regular' },
        { id: 'r2-t3-1000', topic: 'History', value: 1000, text: 'What year did the Berlin Wall fall?', answer: '1989', type: 'cat' },
      ],
    },
    {
      name: 'Science',
      questions: [
        { id: 'r2-t4-200', topic: 'Science', value: 200, text: 'What is the chemical symbol for gold?', answer: 'Au', type: 'regular' },
        { id: 'r2-t4-400', topic: 'Science', value: 400, text: 'What is the powerhouse of the cell?', answer: 'Mitochondria', type: 'regular' },
        { id: 'r2-t4-600', topic: 'Science', value: 600, text: 'What is the speed of light in vacuum?', answer: '299792458 m/s', type: 'regular' },
        { id: 'r2-t4-800', topic: 'Science', value: 800, text: 'Who developed the theory of relativity?', answer: 'Einstein', type: 'regular' },
        { id: 'r2-t4-1000', topic: 'Science', value: 1000, text: 'What is the most abundant gas in Earth\'s atmosphere?', answer: 'Nitrogen', type: 'auction' },
      ],
    },
    {
      name: 'Sports',
      questions: [
        { id: 'r2-t5-200', topic: 'Sports', value: 200, text: 'How many players are on a soccer team?', answer: '11', type: 'regular' },
        { id: 'r2-t5-400', topic: 'Sports', value: 400, text: 'Which sport is known as "the beautiful game"?', answer: 'Soccer', type: 'regular' },
        { id: 'r2-t5-600', topic: 'Sports', value: 600, text: 'Who has won the most Olympic gold medals?', answer: 'Michael Phelps', type: 'regular' },
        { id: 'r2-t5-800', topic: 'Sports', value: 800, text: 'What is the maximum score in 10-pin bowling?', answer: '300', type: 'regular' },
        { id: 'r2-t5-1000', topic: 'Sports', value: 1000, text: 'Which country hosted the 2016 Summer Olympics?', answer: 'Brazil', type: 'regular' },
      ],
    },
    {
      name: 'Literature',
      questions: [
        { id: 'r2-t6-200', topic: 'Literature', value: 200, text: 'Who wrote "Romeo and Juliet"?', answer: 'Shakespeare', type: 'regular' },
        { id: 'r2-t6-400', topic: 'Literature', value: 400, text: 'What is the first book in the Harry Potter series?', answer: 'Philosopher\'s Stone', type: 'regular' },
        { id: 'r2-t6-600', topic: 'Literature', value: 600, text: 'Who wrote "1984"?', answer: 'George Orwell', type: 'regular' },
        { id: 'r2-t6-800', topic: 'Literature', value: 800, text: 'What is the longest novel ever written?', answer: 'In Search of Lost Time', type: 'regular' },
        { id: 'r2-t6-1000', topic: 'Literature', value: 1000, text: 'Who wrote "One Hundred Years of Solitude"?', answer: 'Gabriel Garcia Marquez', type: 'auction' },
      ],
    },
  ],
  catInBagTopics: ['Geography', 'Music', 'Food', 'Technology'],
  catInBagQuestions: [
    { id: 'cat-1', topic: 'Geography', value: 0, text: 'What is the capital of France?', answer: 'Paris', type: 'cat' },
    { id: 'cat-2', topic: 'Music', value: 0, text: 'Who is known as the King of Pop?', answer: 'Michael Jackson', type: 'cat' },
    { id: 'cat-3', topic: 'Food', value: 0, text: 'What is the main ingredient in guacamole?', answer: 'Avocado', type: 'cat' },
    { id: 'cat-4', topic: 'Technology', value: 0, text: 'What does CPU stand for?', answer: 'Central Processing Unit', type: 'cat' },
  ],
  finalQuestion: {
    id: 'final',
    topic: 'World Capitals',
    value: 0,
    text: 'What is the only capital city that spans two continents?',
    answer: 'Istanbul',
    type: 'regular',
  },
};
