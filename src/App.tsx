import { useState, useEffect } from 'react';
import './App.css';
import { GameState, Player } from './types';
import { questionPackage } from './data';

const PLAYER_KEYS = ['a', 'l', ' '];
const QUESTION_TIME = 30;
const FINAL_TIME = 60;

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        playedQuestions: new Set(parsed.playedQuestions),
        finalBets: new Map(parsed.finalBets),
        finalAnswers: new Map(parsed.finalAnswers),
        auctionBets: new Map(parsed.auctionBets),
      };
    }
    return {
      phase: 'setup',
      players: [],
      currentRound: null,
      playedQuestions: new Set(),
      currentQuestion: null,
      currentPlayerIndex: 0,
      answeringPlayerIndex: null,
      timeLeft: 0,
      devMode: false,
      finalBets: new Map(),
      finalAnswers: new Map(),
      auctionBets: new Map(),
      auctionCurrentBidder: null,
      catInBagRecipient: null,
      catInBagBet: null,
    };
  });

  const [playerNames, setPlayerNames] = useState(['', '', '']);
  const [answer, setAnswer] = useState('');
  const [catInBagIndex, setCatInBagIndex] = useState(0);
  const [auctionPhase, setAuctionPhase] = useState<'bidding' | 'answering'>('bidding');
  const [currentBid, setCurrentBid] = useState(0);
  const [finalPlayerIndex, setFinalPlayerIndex] = useState(0);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [finalAnswersSubmitted, setFinalAnswersSubmitted] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const toSave = {
      ...gameState,
      playedQuestions: Array.from(gameState.playedQuestions),
      finalBets: Array.from(gameState.finalBets.entries()),
      finalAnswers: Array.from(gameState.finalAnswers.entries()),
      auctionBets: Array.from(gameState.auctionBets.entries()),
    };
    localStorage.setItem('gameState', JSON.stringify(toSave));
  }, [gameState]);

  useEffect(() => {
    let timer: number;
    if (gameState.timeLeft > 0 && gameState.currentQuestion && gameState.answeringPlayerIndex === null) {
      timer = window.setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.currentQuestion && gameState.answeringPlayerIndex === null) {
      handleTimeOut();
    }
    return () => clearTimeout(timer);
  }, [gameState.timeLeft, gameState.currentQuestion, gameState.answeringPlayerIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.phase !== 'setup' && gameState.currentQuestion && gameState.answeringPlayerIndex === null) {
        const playerIndex = PLAYER_KEYS.indexOf(e.key.toLowerCase());
        if (playerIndex !== -1 && !gameState.players[playerIndex].hasAnswered) {
          setGameState(prev => ({ ...prev, answeringPlayerIndex: playerIndex }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const startGame = () => {
    if (playerNames.every(name => name.trim().length > 0 && name.trim().length <= 20)) {
      const players: Player[] = playerNames.map((name, index) => ({
        id: index,
        name: name.trim(),
        score: 0,
        key: PLAYER_KEYS[index] === ' ' ? 'Space' : PLAYER_KEYS[index].toUpperCase(),
        hasAnswered: false,
      }));
      setGameState({
        ...gameState,
        phase: 'round1',
        players,
        currentRound: {
          number: 1,
          topics: questionPackage.round1,
        },
      });
    }
  };

  const selectQuestion = (questionId: string) => {
    if (gameState.playedQuestions.has(questionId)) return;
    
    const question = gameState.currentRound?.topics
      .flatMap(t => t.questions)
      .find(q => q.id === questionId);
    
    if (!question) return;

    const newPlayedQuestions = new Set(gameState.playedQuestions);
    newPlayedQuestions.add(questionId);

    if (question.type === 'cat') {
      setGameState({
        ...gameState,
        currentQuestion: question,
        playedQuestions: newPlayedQuestions,
        catInBagRecipient: null,
        catInBagBet: null,
      });
    } else if (question.type === 'auction') {
      setGameState({
        ...gameState,
        currentQuestion: question,
        playedQuestions: newPlayedQuestions,
        auctionBets: new Map(),
        auctionCurrentBidder: null,
      });
      setAuctionPhase('bidding');
      setCurrentBid(question.value);
    } else {
      const resetPlayers = gameState.players.map(p => ({ ...p, hasAnswered: false }));
      setGameState({
        ...gameState,
        currentQuestion: question,
        playedQuestions: newPlayedQuestions,
        players: resetPlayers,
        timeLeft: QUESTION_TIME,
        answeringPlayerIndex: null,
      });
    }
  };

  const handleTimeOut = () => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: null,
      answeringPlayerIndex: null,
    }));
    setAnswer('');
  };

  const submitAnswer = () => {
    if (gameState.answeringPlayerIndex === null || !gameState.currentQuestion) return;

    const isCorrect = answer.trim().toLowerCase() === gameState.currentQuestion.answer.toLowerCase();
    const playerIndex = gameState.answeringPlayerIndex;
    const questionValue = gameState.currentQuestion.value;

    const updatedPlayers = [...gameState.players];
    if (isCorrect) {
      updatedPlayers[playerIndex].score += questionValue;
      setGameState({
        ...gameState,
        players: updatedPlayers,
        currentQuestion: null,
        answeringPlayerIndex: null,
        currentPlayerIndex: playerIndex,
      });
      setAnswer('');
    } else {
      updatedPlayers[playerIndex].score -= questionValue;
      updatedPlayers[playerIndex].hasAnswered = true;
      
      const allAnswered = updatedPlayers.every(p => p.hasAnswered);
      if (allAnswered) {
        setGameState({
          ...gameState,
          players: updatedPlayers,
          currentQuestion: null,
          answeringPlayerIndex: null,
        });
        setAnswer('');
      } else {
        setGameState({
          ...gameState,
          players: updatedPlayers,
          answeringPlayerIndex: null,
          timeLeft: QUESTION_TIME,
        });
        setAnswer('');
      }
    }
  };

  const selectCatInBagRecipient = (playerIndex: number) => {
    if (playerIndex === gameState.currentPlayerIndex) return;
    
    const catQuestion = questionPackage.catInBagQuestions[catInBagIndex];
    setCatInBagIndex(prev => (prev + 1) % questionPackage.catInBagQuestions.length);
    
    setGameState(prev => ({
      ...prev,
      catInBagRecipient: playerIndex,
      currentQuestion: catQuestion,
    }));
  };

  const placeCatInBagBet = (bet: number) => {
    setGameState(prev => ({
      ...prev,
      catInBagBet: bet,
      timeLeft: QUESTION_TIME,
      answeringPlayerIndex: prev.catInBagRecipient,
    }));
  };

  const submitCatInBagAnswer = () => {
    if (gameState.catInBagRecipient === null || !gameState.currentQuestion || gameState.catInBagBet === null) return;

    const isCorrect = answer.trim().toLowerCase() === gameState.currentQuestion.answer.toLowerCase();
    const updatedPlayers = [...gameState.players];
    
    if (isCorrect) {
      updatedPlayers[gameState.catInBagRecipient].score += gameState.catInBagBet;
    } else {
      updatedPlayers[gameState.catInBagRecipient].score -= gameState.catInBagBet;
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentQuestion: null,
      answeringPlayerIndex: null,
      currentPlayerIndex: gameState.catInBagRecipient,
      catInBagRecipient: null,
      catInBagBet: null,
    });
    setAnswer('');
  };

  const placeBid = (playerIndex: number, bid: number) => {
    const newBets = new Map(gameState.auctionBets);
    newBets.set(playerIndex, bid);
    setGameState(prev => ({
      ...prev,
      auctionBets: newBets,
      auctionCurrentBidder: playerIndex,
    }));
    setCurrentBid(bid);
  };

  const endAuction = () => {
    if (gameState.auctionCurrentBidder === null) return;
    
    setAuctionPhase('answering');
    setGameState(prev => ({
      ...prev,
      answeringPlayerIndex: prev.auctionCurrentBidder,
      timeLeft: QUESTION_TIME,
    }));
  };

  const submitAuctionAnswer = () => {
    if (gameState.auctionCurrentBidder === null || !gameState.currentQuestion) return;

    const isCorrect = answer.trim().toLowerCase() === gameState.currentQuestion.answer.toLowerCase();
    const bet = gameState.auctionBets.get(gameState.auctionCurrentBidder) || 0;
    const updatedPlayers = [...gameState.players];
    
    if (isCorrect) {
      updatedPlayers[gameState.auctionCurrentBidder].score += bet;
    } else {
      updatedPlayers[gameState.auctionCurrentBidder].score -= bet;
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentQuestion: null,
      answeringPlayerIndex: null,
      currentPlayerIndex: gameState.auctionCurrentBidder,
      auctionBets: new Map(),
      auctionCurrentBidder: null,
    });
    setAnswer('');
    setAuctionPhase('bidding');
  };

  const startRound2 = () => {
    const lowestScoreIndex = gameState.players.reduce((minIdx, player, idx, arr) => 
      player.score < arr[minIdx].score ? idx : minIdx, 0);
    
    setGameState({
      ...gameState,
      phase: 'round2',
      currentRound: {
        number: 2,
        topics: questionPackage.round2,
      },
      currentPlayerIndex: lowestScoreIndex,
    });
  };

  const checkRoundEnd = () => {
    if (!gameState.currentRound) return false;
    const totalQuestions = gameState.currentRound.topics.reduce((sum, topic) => sum + topic.questions.length, 0);
    return gameState.playedQuestions.size >= totalQuestions;
  };

  const transitionToNextPhase = () => {
    if (gameState.phase === 'round1' && checkRoundEnd()) {
      setGameState(prev => ({ ...prev, phase: 'round1-transition' }));
    } else if (gameState.phase === 'round2' && checkRoundEnd()) {
      const playersWithPositiveScore = gameState.players.filter(p => p.score > 0);
      if (playersWithPositiveScore.length > 0) {
        setGameState(prev => ({ ...prev, phase: 'round2-transition' }));
      } else {
        setGameState(prev => ({ ...prev, phase: 'results' }));
      }
    }
  };

  useEffect(() => {
    transitionToNextPhase();
  }, [gameState.playedQuestions.size]);

  const startFinalRound = () => {
    setGameState(prev => ({ ...prev, phase: 'final' }));
    setFinalPlayerIndex(0);
  };

  const placeFinalBet = (bet: number) => {
    const newBets = new Map(gameState.finalBets);
    newBets.set(finalPlayerIndex, bet);
    setGameState(prev => ({ ...prev, finalBets: newBets }));
    
    const nextIndex = finalPlayerIndex + 1;
    const eligiblePlayers = gameState.players.filter(p => p.score > 0);
    
    if (nextIndex >= eligiblePlayers.length) {
      setFinalPlayerIndex(0);
      setShowFinalQuestion(false);
    } else {
      setFinalPlayerIndex(nextIndex);
    }
  };

  const showFinalQuestionForPlayer = () => {
    setShowFinalQuestion(true);
    setGameState(prev => ({ ...prev, timeLeft: FINAL_TIME }));
  };

  const submitFinalAnswer = () => {
    const eligiblePlayers = gameState.players.filter(p => p.score > 0);
    const actualPlayerIndex = eligiblePlayers[finalPlayerIndex].id;
    
    const newAnswers = new Map(gameState.finalAnswers);
    newAnswers.set(actualPlayerIndex, answer);
    setGameState(prev => ({ ...prev, finalAnswers: newAnswers }));
    
    const newSubmitted = [...finalAnswersSubmitted];
    newSubmitted[actualPlayerIndex] = true;
    setFinalAnswersSubmitted(newSubmitted);
    
    setAnswer('');
    setShowFinalQuestion(false);
    
    const nextIndex = finalPlayerIndex + 1;
    if (nextIndex >= eligiblePlayers.length) {
      calculateFinalScores();
    } else {
      setFinalPlayerIndex(nextIndex);
    }
  };

  const calculateFinalScores = () => {
    const updatedPlayers = [...gameState.players];
    gameState.finalAnswers.forEach((answer, playerIndex) => {
      const bet = gameState.finalBets.get(playerIndex) || 0;
      const isCorrect = answer.trim().toLowerCase() === questionPackage.finalQuestion.answer.toLowerCase();
      
      if (isCorrect) {
        updatedPlayers[playerIndex].score += bet;
      } else {
        updatedPlayers[playerIndex].score -= bet;
      }
    });
    
    setGameState(prev => ({ ...prev, players: updatedPlayers, phase: 'results' }));
  };

  const toggleDevMode = () => {
    setGameState(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const updatePlayerScore = (playerIndex: number, newScore: number) => {
    const updatedPlayers = [...gameState.players];
    updatedPlayers[playerIndex].score = newScore;
    setGameState(prev => ({ ...prev, players: updatedPlayers }));
  };

  if (gameState.phase === 'setup') {
    return (
      <div className="setup-screen">
        <h1>Quiz Game</h1>
        <div className="player-inputs">
          {[0, 1, 2].map(i => (
            <div key={i} className="player-input-group">
              <h3>Player {i + 1}</h3>
              <input
                type="text"
                value={playerNames[i]}
                onChange={(e) => {
                  const newNames = [...playerNames];
                  newNames[i] = e.target.value;
                  setPlayerNames(newNames);
                }}
                placeholder="Enter name"
                maxLength={20}
              />
              <div className="key-display">
                Answer Key: {PLAYER_KEYS[i] === ' ' ? 'Space' : PLAYER_KEYS[i].toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-start"
          onClick={startGame}
          disabled={!playerNames.every(name => name.trim().length > 0 && name.trim().length <= 20)}
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameState.phase === 'round1-transition') {
    return (
      <div className="container">
        <div className="transition-screen">
          <h1>Round 1 Complete!</h1>
          <div className="scores-display">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card">
                <div className="player-name">{player.name}</div>
                <div className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
                  {player.score}
                </div>
              </div>
            ))}
          </div>
          <button className="btn" onClick={startRound2}>
            Start Round 2
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'round2-transition') {
    const eligiblePlayers = gameState.players.filter(p => p.score > 0);
    return (
      <div className="container">
        <div className="transition-screen">
          <h1>Round 2 Complete!</h1>
          <div className="scores-display">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card">
                <div className="player-name">{player.name}</div>
                <div className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
                  {player.score}
                </div>
              </div>
            ))}
          </div>
          <h2>Players advancing to Final Round:</h2>
          <div className="scores-display">
            {eligiblePlayers.map(player => (
              <div key={player.id} className="player-card">
                <div className="player-name">{player.name}</div>
              </div>
            ))}
          </div>
          <button className="btn" onClick={startFinalRound}>
            Start Final Round
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'final') {
    const eligiblePlayers = gameState.players.filter(p => p.score > 0);
    const allBetsPlaced = eligiblePlayers.every(p => gameState.finalBets.has(p.id));
    const allAnswersSubmitted = eligiblePlayers.every(p => gameState.finalAnswers.has(p.id));

    if (allAnswersSubmitted) {
      return (
        <div className="container final-round">
          <h1>Final Round - Results</h1>
          <div className="final-topic">Topic: {questionPackage.finalQuestion.topic}</div>
          <div className="question-text">{questionPackage.finalQuestion.text}</div>
          <div className="dev-mode">
            <div className="dev-correct-answer">Correct Answer: {questionPackage.finalQuestion.answer}</div>
          </div>
          <div className="scores-display" style={{ flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
            {eligiblePlayers.map(player => (
              <div key={player.id} className="player-card" style={{ padding: '20px' }}>
                <div className="player-name">{player.name}</div>
                <div>Bet: {gameState.finalBets.get(player.id)}</div>
                <div>Answer: {gameState.finalAnswers.get(player.id)}</div>
              </div>
            ))}
          </div>
          <button className="btn" onClick={calculateFinalScores} style={{ marginTop: '30px' }}>
            Show Final Scores
          </button>
        </div>
      );
    }

    if (!allBetsPlaced) {
      const currentPlayer = eligiblePlayers[finalPlayerIndex];
      return (
        <div className="container final-round">
          <h1>Final Round</h1>
          <div className="final-topic">Topic: {questionPackage.finalQuestion.topic}</div>
          <div className="betting-section">
            <h2>{currentPlayer.name}, place your bet</h2>
            <p>Current Score: {currentPlayer.score}</p>
            <p>Bet range: 1 to {currentPlayer.score}</p>
            <input
              type="number"
              className="bet-input"
              min={1}
              max={currentPlayer.score}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter bet"
            />
            <button
              className="btn"
              onClick={() => {
                const bet = parseInt(answer);
                if (bet >= 1 && bet <= currentPlayer.score) {
                  placeFinalBet(bet);
                  setAnswer('');
                }
              }}
            >
              Confirm Bet
            </button>
          </div>
        </div>
      );
    }

    const currentPlayer = eligiblePlayers[finalPlayerIndex];
    
    if (!showFinalQuestion) {
      return (
        <div className="container final-round">
          <h1>Final Round</h1>
          <div className="waiting-message">
            <p>{currentPlayer.name}, get ready!</p>
            <p>Other players, please look away.</p>
            <button className="btn" onClick={showFinalQuestionForPlayer} style={{ marginTop: '20px' }}>
              I'm Ready
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container final-round">
        <h1>Final Round - {currentPlayer.name}</h1>
        <div className="final-topic">Topic: {questionPackage.finalQuestion.topic}</div>
        <div className="question-text">{questionPackage.finalQuestion.text}</div>
        <div className="question-timer">{gameState.timeLeft}s</div>
        <div className="answer-section">
          <input
            type="text"
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button className="btn" onClick={submitFinalAnswer}>
            Submit Answer
          </button>
        </div>
        {gameState.devMode && (
          <div className="dev-mode">
            <div className="dev-correct-answer">Correct Answer: {questionPackage.finalQuestion.answer}</div>
          </div>
        )}
      </div>
    );
  }

  if (gameState.phase === 'results') {
    const winner = gameState.players.reduce((max, player) => 
      player.score > max.score ? player : max, gameState.players[0]);
    
    return (
      <div className="container results-screen">
        <h1>Game Over!</h1>
        <div className="winner-announcement">
          Winner: {winner.name}
        </div>
        <div className="final-scores">
          {gameState.players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-name">{player.name}</div>
              <div className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
                {player.score}
              </div>
            </div>
          ))}
        </div>
        <button className="btn" onClick={() => {
          localStorage.removeItem('gameState');
          window.location.reload();
        }}>
          New Game
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="game-header">
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className={`player-card ${
              index === gameState.currentPlayerIndex && !gameState.currentQuestion ? 'active' : ''
            } ${
              index === gameState.answeringPlayerIndex ? 'answering' : ''
            }`}
          >
            <div className="player-name">{player.name}</div>
            <div className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
              {player.score}
            </div>
            <div className="player-key">Key: {player.key}</div>
          </div>
        ))}
      </div>

      {gameState.devMode && (
        <div className="dev-controls">
          <h3>Dev Mode</h3>
          <div className="score-editor">
            {gameState.players.map((player, index) => (
              <div key={player.id}>
                <label>{player.name}: </label>
                <input
                  type="number"
                  value={player.score}
                  onChange={(e) => updatePlayerScore(index, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Round {gameState.currentRound?.number}</h2>
        {!gameState.currentQuestion && (
          <p style={{ color: '#ffd700' }}>
            {gameState.players[gameState.currentPlayerIndex].name} - Select a question
          </p>
        )}
        <button className="btn" onClick={toggleDevMode} style={{ marginTop: '10px' }}>
          Toggle Dev Mode
        </button>
      </div>

      {!gameState.currentQuestion && gameState.currentRound && (
        <div className="game-board">
          {gameState.currentRound.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="topic-row">
              <div className="topic-header">{topic.name}</div>
              {topic.questions.map((question, qIndex) => {
                const isPlayed = gameState.playedQuestions.has(question.id);
                const isSpecial = gameState.devMode && question.type !== 'regular';
                return (
                  <div
                    key={qIndex}
                    className={`question-cell ${isPlayed ? 'played' : ''} ${
                      isSpecial ? `special special-${question.type}` : ''
                    }`}
                    onClick={() => !isPlayed && selectQuestion(question.id)}
                  >
                    {!isPlayed ? question.value : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'cat' && gameState.catInBagRecipient === null && (
        <div className="cat-in-bag-phase">
          <h2>Cat in the Bag! 🐱</h2>
          <p>{gameState.players[gameState.currentPlayerIndex].name}, choose a player to give this question:</p>
          <div className="player-selection">
            {gameState.players.map((player, index) => (
              index !== gameState.currentPlayerIndex && (
                <button
                  key={player.id}
                  className="btn player-select-btn"
                  onClick={() => selectCatInBagRecipient(index)}
                >
                  {player.name}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'cat' && gameState.catInBagRecipient !== null && gameState.catInBagBet === null && (
        <div className="cat-in-bag-phase">
          <h2>Cat in the Bag - {gameState.currentQuestion.topic}</h2>
          <p>{gameState.players[gameState.catInBagRecipient].name}, place your bet:</p>
          <div className="player-selection">
            {gameState.currentRound?.number === 1 ? (
              <>
                <button className="btn" onClick={() => placeCatInBagBet(100)}>100</button>
                <button className="btn" onClick={() => placeCatInBagBet(500)}>500</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => placeCatInBagBet(200)}>200</button>
                <button className="btn" onClick={() => placeCatInBagBet(1000)}>1000</button>
              </>
            )}
          </div>
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'cat' && gameState.catInBagBet !== null && (
        <div className="question-display">
          <div className="question-header-info">
            <div className="question-type">Cat in the Bag - {gameState.currentQuestion.topic}</div>
            <div className="question-timer">{gameState.timeLeft}s</div>
          </div>
          <div className="question-text">{gameState.currentQuestion.text}</div>
          <div className="answer-section">
            <input
              type="text"
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
            />
            <div className="answer-buttons">
              <button className="btn" onClick={submitCatInBagAnswer}>
                Submit
              </button>
            </div>
          </div>
          {gameState.devMode && (
            <div className="dev-mode">
              <div className="dev-correct-answer">Correct Answer: {gameState.currentQuestion.answer}</div>
            </div>
          )}
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'auction' && auctionPhase === 'bidding' && (
        <div className="auction-phase">
          <h2>Auction! 🔨</h2>
          <p>Minimum bid: {gameState.currentQuestion.value}</p>
          <div className="auction-bids">
            <h3>Current Bids:</h3>
            {Array.from(gameState.auctionBets.entries()).map(([playerIndex, bid]) => (
              <div key={playerIndex} className="bid-row">
                <span>{gameState.players[playerIndex].name}</span>
                <span>{bid}</span>
              </div>
            ))}
          </div>
          <div className="player-selection">
            {gameState.players.map((player, index) => (
              <div key={player.id}>
                <p>{player.name} (Score: {player.score})</p>
                <input
                  type="number"
                  min={currentBid + 1}
                  max={player.score}
                  placeholder="Bid amount"
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button
                  className="btn"
                  onClick={() => {
                    const bid = parseInt(answer);
                    if (bid >= currentBid && bid <= player.score) {
                      placeBid(index, bid);
                      setAnswer('');
                    }
                  }}
                >
                  Place Bid
                </button>
              </div>
            ))}
          </div>
          <button className="btn" onClick={endAuction} disabled={gameState.auctionCurrentBidder === null}>
            End Auction
          </button>
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'auction' && auctionPhase === 'answering' && (
        <div className="question-display">
          <div className="question-header-info">
            <div className="question-type">
              Auction - {gameState.auctionCurrentBidder !== null && gameState.players[gameState.auctionCurrentBidder].name} answers
            </div>
            <div className="question-timer">{gameState.timeLeft}s</div>
          </div>
          <div className="question-text">{gameState.currentQuestion.text}</div>
          <div className="answer-section">
            <input
              type="text"
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
            />
            <div className="answer-buttons">
              <button className="btn" onClick={submitAuctionAnswer}>
                Submit
              </button>
            </div>
          </div>
          {gameState.devMode && (
            <div className="dev-mode">
              <div className="dev-correct-answer">Correct Answer: {gameState.currentQuestion.answer}</div>
            </div>
          )}
        </div>
      )}

      {gameState.currentQuestion && gameState.currentQuestion.type === 'regular' && (
        <div className="question-display">
          <div className="question-header-info">
            <div className="question-type">{gameState.currentQuestion.topic} - {gameState.currentQuestion.value}</div>
            <div className={`question-timer ${gameState.timeLeft <= 10 ? 'warning' : ''}`}>
              {gameState.timeLeft}s
            </div>
          </div>
          <div className="question-text">{gameState.currentQuestion.text}</div>
          {gameState.answeringPlayerIndex === null ? (
            <div className="waiting-message">
              Press your key to answer: {gameState.players.map(p => !p.hasAnswered && p.key).filter(Boolean).join(', ')}
            </div>
          ) : (
            <div className="answer-section">
              <h3>{gameState.players[gameState.answeringPlayerIndex].name} is answering</h3>
              <input
                type="text"
                className="answer-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                autoFocus
              />
              <div className="answer-buttons">
                <button className="btn" onClick={submitAnswer}>
                  Submit
                </button>
              </div>
            </div>
          )}
          {gameState.devMode && (
            <div className="dev-mode">
              <div className="dev-correct-answer">Correct Answer: {gameState.currentQuestion.answer}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
