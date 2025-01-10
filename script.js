const gameCards = [
  { id: 1, src: 'assets/Game cards/dragon.png', name:"Dragon" },
  { id: 2, src: 'assets/Game cards/Flower.png', name:"Flower" },
  { id: 3, src: 'assets/Game cards/lugi.png', name:"Lugi" },
  { id: 4, src: 'assets/Game cards/mario.png', name:"Mario" },
  { id: 5, src: 'assets/Game cards/mushroom.png', name:"Mushroom" },
  { id: 6, src: 'assets/Game cards/princess.png', name:"Princess" },
  { id: 7, src: 'assets/Game cards/superloser.png', name:"Superloser" },
  { id: 8, src: 'assets/Game cards/tine.png', name:"Tine" },
  { id: 9, src: 'assets/Game cards/coin.png', name:"Coin" },
  { id: 10, src: 'assets/Game cards/egg.png', name:"Egg" },
];

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer;
let seconds = 0;
let currentLevel = null;

const flippingSound = document.getElementById('flipping-audio');
const matchingSound = document.getElementById('matching-audio');
const winningSound = document.getElementById('winning-audio');
const mismatchingSound = document.getElementById('wrong-audio');

function updateTimerDisplay() {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  document.getElementById('time').textContent = minutes + ":" + remainingSeconds;
}


function startTimer() {
  timer = setInterval(() => {
      seconds++;
      updateTimerDisplay();
  }, 1000);
};

function stopTimer() {
  clearInterval(timer);
};

function resetGame() {
  stopTimer();
  startGame(currentLevel);
  document.getElementById('moves').textContent = `Moves: 0`;
}

const startGame = (level) => {
  currentLevel = level;
    // Show the reset button
  document.getElementById('reset').style.display = 'inline-block';
  const container = document.querySelector('main.grid-container');

  let cardNum;
  if(level === "easy"){
      cardNum = 12;
      container.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if(level === "medium"){
      cardNum = 16;
      container.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if(level === "hard"){
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
  
   // Reset everything when starting a new game
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  seconds = 0;
  updateTimerDisplay();
  
  //Start Timer
  startTimer();
};

const handleCardClick = (event) => {
  //play flip sound
    flippingSound.play();
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
  const clickedCard = event.target.closest('.card');
  if (!clickedCard || flippedCards.includes(clickedCard) || matchedCards.includes(clickedCard)) {
      return;
  }

  clickedCard.classList.add('flipped');
  flippedCards.push(clickedCard);
  if (flippedCards.length === 2) {

      const [firstCard, secondCard] = flippedCards;
      if (firstCard.dataset.id === secondCard.dataset.id) {
          matchedCards.push(firstCard, secondCard);
          flippedCards = [];

          //play match sound
          setTimeout(()=>{
            matchingSound.play();
          }, 500)

          if (matchedCards.length === document.querySelector('#game-play-content').children.length) {
              stopTimer();
              showWinMessageWithAnime();
              //play win sound
              winningSound.play();
          }
      } else {
          setTimeout(() => {
              firstCard.classList.remove('flipped');
              secondCard.classList.remove('flipped');
              flippedCards = [];
              //play wrong sound
              mismatchingSound.play();
          }, 1000);
      }
  }
}

const showWinMessageWithAnime = () => {
  const winMessage = document.createElement('div');
  winMessage.id = 'winMessage';
  winMessage.textContent = `Congratulations!.. you won after ${moves} moves!`;
  winMessage.style.position = 'absolute';
  winMessage.style.top = '-100px';
  winMessage.style.left = '50%';
  winMessage.style.transform = 'translateX(-50%)';
  winMessage.style.fontSize = '24px';
  winMessage.style.color = '#ffcc00';
  winMessage.style.fontWeight = 'bold';
  winMessage.style.textAlign = 'center';
  winMessage.style.padding = '1rem';
  document.body.appendChild(winMessage);

  
  anime({
      fontSize: '25px',
      targets: winMessage,
      top: '50px', 
      duration: 1000,
      easing: 'easeOutBounce', 
      complete: () => {
          setTimeout(() => {
              anime({
                winMessage: winMessage.remove(),
                  targets: winMessage,
                  top: '-100px',
                  duration: 800,
                  easing: 'easeInQuad',
              });
          }, 7000);
      }
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