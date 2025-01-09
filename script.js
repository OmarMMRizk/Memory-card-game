// Game cards 
const gameCards = [
  { id: 1, src: 'assets/Game cards/dragon.png', name: "Dragon" },
  { id: 2, src: 'assets/Game cards/Flower.png', name: "Flower" },
  { id: 3, src: 'assets/Game cards/lugi.png', name: "Lugi" },
  { id: 4, src: 'assets/Game cards/mario.png', name: "Mario" },
  { id: 5, src: 'assets/Game cards/mushroom.png', name: "Mushroom" },
  { id: 6, src: 'assets/Game cards/princess.png', name: "Princess" },
  { id: 7, src: 'assets/Game cards/superloser.png', name: "Superloser" },
  { id: 8, src: 'assets/Game cards/tine.png', name: "Tine" },
  { id: 9, src: 'assets/Game cards/coin.png', name: "Coin" },
  { id: 10, src: 'assets/Game cards/egg.png', name: "Egg" },
];

// Game  variables
let flippedCards = [];      
let matchedCards = [];     
let moves = 0;             
let seconds = 0;          
let currentLevel = null;    
let activeTimer = null;     

// Audio elements
const flippingSound = document.getElementById('flipping-audio');
const matchingSound = document.getElementById('matching-audio');
const winningSound = document.getElementById('winning-audio');
const mismatchingSound = document.getElementById('wrong-audio');

// best score
function saveBestScore(moves) {
  const bestScore = localStorage.getItem('bestScore');
  if (!bestScore || moves < bestScore) {
      localStorage.setItem('bestScore', moves);
      return true; 
  }
  return false;
}

// Update timer 
function updateTimerDisplay() {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  document.getElementById('time').textContent = `${minutes}:${remainingSeconds}`;
}

// Start and restart timer 
function startTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
  }
  seconds = 0;
  updateTimerDisplay();
  activeTimer = setInterval(() => {
    seconds++;
    updateTimerDisplay();
  }, 1000);
}

// Stop timer 
function stopTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}

// Reset game 
function resetGame() {
  stopTimer();
  startGame(currentLevel);
  document.getElementById('moves').textContent = `Moves: 0`;
}

// levels
const startGame = (level) => {
  currentLevel = level;
  document.getElementById('reset').style.display = 'inline-block';
  const container = document.querySelector('main.grid-container');

  // level grid
  let cardNum;
  if (level === "easy") {
      cardNum = 12;
      container.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (level === "medium") {
      cardNum = 16;
      container.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (level === "hard") {
      cardNum = 20;
      container.style.gridTemplateColumns = 'repeat(5, 1fr)';
  }

  //  shuffled cards
  const gameLevel = [...gameCards.slice(0, cardNum / 2), ...gameCards.slice(0, cardNum / 2)];
  gameLevel.sort(() => 0.5 - Math.random());

  const gameGrid = document.querySelector('#game-play-content');
  gameGrid.innerHTML = '';
  gameLevel.forEach((card) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.name = card.name;
      cardElement.dataset.id = card.id;
      cardElement.innerHTML = `
          <img class="front-face img" src="${card.src}" alt="${card.name}" />
          <img class="back-face img" src="assets/Game cards/cardback.png" alt="Back" />
      `;
      gameGrid.appendChild(cardElement);
  });

 
  const allCards = document.querySelectorAll('.card');
  allCards.forEach((card) => card.addEventListener('click', handleCardClick));
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  startTimer();
};

// Handle card click logic
const handleCardClick = (event) => {
  flippingSound.play();
  const clickedCard = event.target.closest('.card');
  if (!clickedCard || flippedCards.includes(clickedCard) || matchedCards.includes(clickedCard)) return;

  clickedCard.classList.add('flipped');
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
      moves++;
      document.getElementById('moves').textContent = `Moves: ${moves}`;

      const [firstCard, secondCard] = flippedCards;

      if (firstCard.dataset.id === secondCard.dataset.id) {
          matchedCards.push(firstCard, secondCard);
          flippedCards = [];
          matchingSound.play();

          if (matchedCards.length === document.querySelector('#game-play-content').children.length) {
              stopTimer();
              showWinMessageWithAnime();
              winningSound.play();
          }
      } else {
          setTimeout(() => {
              firstCard.classList.remove('flipped');
              secondCard.classList.remove('flipped');
              flippedCards = [];
              mismatchingSound.play();
          }, 1000);
      }
  }
};

//  win message with animation
const showWinMessageWithAnime = () => {
  const isHighScore = saveBestScore(moves);
  const winMessage = document.createElement('div');
  winMessage.id = 'winMessage';
  const bestScoreMessage = isHighScore ? " It's the best score in the game!" : "";
  winMessage.textContent = `Congratulations!.. you won after ${moves} moves!${bestScoreMessage}`;
  document.body.appendChild(winMessage);
  winMessage.classList.add('show');

  setTimeout(() => {
      winMessage.classList.remove('show');
      setTimeout(() => {
          winMessage.remove()
      }, 800);
  }, 7000);
};


const levelBtns = document.querySelectorAll('.level');
levelBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
      startGame(e.target.value);
  });
});

//reset event listner
const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', resetGame);

// Volume control 
const audioOfTheGame = document.querySelectorAll('audio');
const volumeController = document.getElementById('sound-valume');

volumeController.addEventListener('input', () => {
  const volume = volumeController.value / 100;
  audioOfTheGame.forEach(audio => {
      audio.volume = volume;
  });
});