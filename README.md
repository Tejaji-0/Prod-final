# Quiz Game - Browser-Based Intellectual Game

A browser-based quiz game inspired by classic TV quiz shows, implemented with React and TypeScript.

## Features

### Core Features

1. **Game Setup**
   - Three players with name input validation
   - Assigned keyboard keys (A, L, Space) for each player

2. **Pre-loaded Content**
   - Two complete rounds with 6 topics each
   - 5 questions per topic (100-500 points in Round 1, 200-1000 points in Round 2)
   - 4 "Cat in the Bag" special questions
   - 4 "Auction" special questions
   - 1 Final round question

3. **Game Board & Main Rounds**
   - Visual game board with topics and question values
   - Player scores displayed in real-time
   - Played questions disappear from the board
   - Clear indication of which player is selecting/answering
   - Automatic round transitions with summary screens
   - State persistence (survives page refresh)

4. **Question Types**
   - **Regular Questions**: 30-second timer, players buzz in with keyboard keys
   - **Cat in the Bag**: Surprise questions passed to another player with fixed bets
   - **Auction**: Bidding system where highest bidder answers the question

5. **Final Round**
   - Only players with positive scores participate
   - Secret betting system
   - Sequential question display for privacy
   - 60-second timer per player

6. **Dev Mode**
   - Toggle dev mode from the game interface
   - Highlights special question types on the board
   - Shows correct answers during questions
   - Allows manual score adjustment for testing

## Installation & Running

### Prerequisites
- Node.js LTS version

### Setup
```bash
npm ci
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```
Static files will be output to the `public` folder.

### Production
```bash
npm start
```
The application will start on port 3000.

## Game Rules

### Main Rounds
1. Players take turns selecting questions from the board
2. First player to press their key gets to answer
3. Correct answers add points, incorrect answers subtract points
4. Special questions ("Cat in the Bag" and "Auction") appear randomly
5. Round ends when all questions are played

### Final Round
1. Only players with positive scores advance
2. Players place secret bets (1 to their current score)
3. Question shown to each player sequentially
4. Correct answers add the bet amount, incorrect answers subtract it
5. Player with highest score wins

## Technical Details

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React hooks with localStorage persistence
- **Styling**: CSS with responsive design

## Project Structure
```
src/
├── App.tsx          # Main application component
├── App.css          # Styles
├── types.ts         # TypeScript interfaces
├── data.ts          # Question data
└── main.tsx         # Entry point
```

## Development Notes

- Game state is automatically saved to localStorage
- Page refreshes preserve the current game state
- Dev mode can be toggled at any time for testing
- All questions, topics, and answers are stored in `src/data.ts`
