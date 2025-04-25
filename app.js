// DOM Elements
const elements = {
  playerChoiceImg: document.getElementById('player-choice-img'),
  playerChoiceText: document.getElementById('player-choice-text'),
  computerChoiceImg: document.getElementById('computer-choice-img'),
  computerChoiceText: document.getElementById('computer-choice-text'),
  resultMessage: document.getElementById('result-message'),
  playerScore: document.getElementById('player-score'),
  computerScore: document.getElementById('computer-score'),
  tieScore: document.getElementById('tie-score'),
  weaponButtons: document.querySelectorAll('.weapon-btn'),
  voiceBtn: document.getElementById('voice-btn'),
  voiceStatus: document.getElementById('voice-status')
};

// Game state
const gameState = {
  scores: {
      player: 0,
      computer: 0,
      tie: 0
  },
  choices: ['rock', 'paper', 'scissors'],
  isListening: false
};

// Initialize speech recognition
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
      elements.voiceBtn.disabled = true;
      elements.voiceStatus.textContent = "Voice control not supported in your browser";
      return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
      gameState.isListening = true;
      elements.voiceBtn.classList.add('listening');
      elements.voiceStatus.textContent = "Listening... Say 'rock', 'paper', or 'scissors'";
  };

  recognition.onerror = (event) => {
      gameState.isListening = false;
      elements.voiceBtn.classList.remove('listening');
      elements.voiceStatus.textContent = `Error: ${event.error}`;
      setTimeout(() => {
          elements.voiceStatus.textContent = "Click mic to try again";
      }, 2000);
  };

  recognition.onend = () => {
      gameState.isListening = false;
      elements.voiceBtn.classList.remove('listening');
      if (!elements.voiceStatus.textContent.includes('Error')) {
          elements.voiceStatus.textContent = "Ready for voice commands";
      }
  };

  recognition.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
      elements.voiceStatus.textContent = `You said: ${spokenWord}`;
      
      if (gameState.choices.includes(spokenWord)) {
          playRound(spokenWord);
      } else {
          elements.voiceStatus.textContent = `Please say 'rock', 'paper', or 'scissors'. You said: ${spokenWord}`;
          speak(`I didn't understand. Please say rock, paper, or scissors.`);
      }
  };

  return recognition;
}

// Text-to-speech function
function speak(text) {
  if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
  }
}

// Determine the winner
function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return 'tie';
  
  const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
  };
  
  return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

// Play a round of the game
function playRound(playerChoice) {
  // Set player choice
  elements.playerChoiceImg.src = `images/${playerChoice}.png`;
  elements.playerChoiceImg.alt = playerChoice;
  elements.playerChoiceText.textContent = playerChoice;
  
  // Generate computer choice
  const computerChoice = gameState.choices[Math.floor(Math.random() * gameState.choices.length)];
  elements.computerChoiceImg.src = `images/${computerChoice}.png`;
  elements.computerChoiceImg.alt = computerChoice;
  elements.computerChoiceText.textContent = computerChoice;
  
  // Determine result
  const result = determineWinner(playerChoice, computerChoice);
  
  // Update game state
  updateGame(result, playerChoice, computerChoice);
}

// Update game after a round
function updateGame(result, playerChoice, computerChoice) {
  // Update scores
  gameState.scores[result === 'tie' ? 'tie' : result === 'win' ? 'player' : 'computer']++;
  
  // Update displays
  elements.playerScore.textContent = gameState.scores.player;
  elements.computerScore.textContent = gameState.scores.computer;
  elements.tieScore.textContent = gameState.scores.tie;
  
  // Set result message
  const messages = {
      win: `You win! ${playerChoice} beats ${computerChoice}`,
      lose: `You lose! ${computerChoice} beats ${playerChoice}`,
      tie: `It's a tie! Both chose ${playerChoice}`
  };
  
  elements.resultMessage.textContent = messages[result];
  elements.resultMessage.className = 'result-message animate__animated';
  
  // Add appropriate animation class
  if (result === 'win') {
      elements.resultMessage.classList.add('animate__bounceIn', 'win-text');
  } else if (result === 'lose') {
      elements.resultMessage.classList.add('animate__shakeX', 'lose-text');
  } else {
      elements.resultMessage.classList.add('animate__flipInX', 'tie-text');
  }
  
  // Speak the result
  speak(messages[result]);
  
  // Reset animation class after delay
  setTimeout(() => {
      elements.resultMessage.className = 'result-message';
  }, 1000);
}

// Initialize the game
function init() {
  const recognition = initSpeechRecognition();
  
  // Set up voice button
  if (recognition) {
      elements.voiceBtn.addEventListener('click', () => {
          if (!gameState.isListening) {
              try {
                  recognition.start();
              } catch (error) {
                  elements.voiceStatus.textContent = `Error: ${error.message}`;
              }
          }
      });
  }
  
  // Set up weapon buttons
  elements.weaponButtons.forEach(button => {
      button.addEventListener('click', () => {
          playRound(button.id);
      });
  });
  
  // Initialize scores
  updateGame('tie', 'rock', 'rock');
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
