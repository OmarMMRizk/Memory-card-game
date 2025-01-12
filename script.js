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

let flippedCards = [];      
let matchedCards = [];     
let moves = 0;             
let seconds = 0;          
let currentLevel = 'easy';    //default mode
let activeTimer = null;     

const flippingSound = document.getElementById('flipping-audio');
const matchingSound = document.getElementById('matching-audio');
const winningSound = document.getElementById('winning-audio');
const mismatchingSound = document.getElementById('wrong-audio');

//best score
function saveBestScore(moves) {
  const bestScore = localStorage.getItem('bestScore');
  if (!bestScore || moves < bestScore) {
      localStorage.setItem('bestScore', moves);
      return true; 
  }
  return false;
}

//timer
function updateTimerDisplay() {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }

  var timeElement = document.getElementById("time");
  timeElement.textContent = minutes + ":" + remainingSeconds;
}

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

function stopTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}

//reset
function resetGame() {
  stopTimer();
  startGame(currentLevel);
  document.getElementById('moves').textContent = `Moves: 0`;
}

const startGame = (level) => {
  currentLevel = level;
  document.getElementById('reset').style.display = 'inline-block';
  const container = document.querySelector('main.grid-container');

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

// starting the game with easy mode as default

window.addEventListener("load", (e) => {
  const popup = document.querySelector('#start-game');
  popup.style.display='block';
  const startButton = document.querySelector('#start-button');
  startButton.addEventListener('click',()=>{
  popup.style.display='none';
  startGame(currentLevel);
})
});

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
          firstCard.removeEventListener('click',handleCardClick);
          firstCard.style.cursor = 'default';
          secondCard.removeEventListener('click',handleCardClick);
          secondCard.style.cursor = 'default';
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

const showWinMessageWithAnime = () => {
  const tryAgainBtn = document.createElement('button');
  const winMessage = document.createElement('div');
  winMessage.style.display = 'flex';
  winMessage.style.flexDirection = 'column';
  winMessage.style.justifyContent = 'center';
  winMessage.style.justifyContent = 'center';
  winMessage.id = 'winMessage';
  tryAgainBtn.textContent = 'Try Again !';
  tryAgainBtn.style.border = '1px solid black';
  tryAgainBtn.style.padding = '10px 20px';
  tryAgainBtn.style.marginTop = '10px';
  tryAgainBtn.style.cursor = 'pointer';
  tryAgainBtn.style.backgroundColor = '#eeaf36';
  tryAgainBtn.style.fontWeight = 'bold';
  tryAgainBtn.style.borderRadius = '8px';
  tryAgainBtn.classList.add('tryAgainBtn'); 
  let HighScore = saveBestScore(moves);
  let bestScoreMessage = HighScore ? " It's the best score in the game!" : "";
  winMessage.style.height = '200px';
  winMessage.textContent = `Congratulations!.. you won after ${moves} moves!${bestScoreMessage}`;
  winMessage.style.position = 'absolute';
  winMessage.style.top = '-100px';
  winMessage.style.left = '50%';
  winMessage.style.transform = 'translateX(-50%)';
  winMessage.style.fontSize = '24px';
  winMessage.style.color = '#ffcc00';
  winMessage.style.fontWeight = 'bold';
  winMessage.style.textAlign = 'center';
  winMessage.style.padding = '1rem';
  winMessage.style.backgroundColor = '#333';
  winMessage.style.borderRadius = '8px';
  winMessage.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  document.body.appendChild(winMessage);
  winMessage.appendChild(tryAgainBtn);

  
  anime({
    targets: winMessage,
    top: '50px',
    fontSize: '30px',
    duration: 1000,
    easing: 'easeOutBounce',
    complete: () => {
      setTimeout(() => {
        anime({
          targets: winMessage,
          top: '-100px',
          duration: 800,
          easing: 'easeInQuad',
          complete: () => {
            winMessage.remove();
          },
        });
      }, 7000);
    },
  });

  tryAgainBtn.addEventListener('click', () => {
    winMessage.remove();
    resetGame(); 
  });
};

const levelBtns = document.querySelectorAll('.level');
levelBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
      startGame(e.target.value);
  });
});

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', resetGame);

const audioOfTheGame = document.querySelectorAll('audio');
const volumeController = document.getElementById('sound-valume');

volumeController.addEventListener('input', () => {
  const volume = volumeController.value / 100;
  audioOfTheGame.forEach(audio => {
      audio.volume = volume;
  });
});

//applying mute feature to volume icon
const vIcon = document.querySelector('i.volume-icon');
vIcon.addEventListener('click',(e)=>{
  if(vIcon.classList.contains('fa-volume-high')){

      vIcon.classList.remove('fa-volume-high');
      vIcon.classList.add('fa-volume-xmark');
      audioOfTheGame.forEach(audio => {
        audio.volume = 0;
    });
    volumeController.value = 0;
  } else {
    vIcon.classList.remove('fa-volume-xmark');
    vIcon.classList.add('fa-volume-high');
    audioOfTheGame.forEach(audio => {
      audio.volume = 0.5;
  });
  volumeController.value = 50;
  }
})