
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
]

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer;

const startGame = (level) => {
    let cardNum;
    if(level === "easy"){
        cardNum = 12;
    } else if(level === "medium"){
        cardNum = 16;
    } else if(level === "hard"){
        cardNum = 20;
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


}

const handleCardClick = (event) => {
    const clickedCard = event.target.closest('.card');
    if (!clickedCard || flippedCards.includes(clickedCard) || matchedCards.includes(clickedCard)) {
        return;
    }

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;

        const [firstCard, secondCard] = flippedCards;
        if (firstCard.dataset.id === secondCard.dataset.id) {
            matchedCards.push(firstCard, secondCard);
            flippedCards = [];
            if (matchedCards.length === document.querySelector('#game-play-content').children.length) {
                clearInterval(timer);
                alert(`Congratulations! You won in ${moves} moves and ${time} seconds.`);
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

const levelBtns = document.querySelectorAll('.level');
levelBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        startGame(e.target.value);
    });
});

const audioOfTheGame = document.querySelectorAll('audio');
const volumeController = document.getElementById('sound-volume');

volumeController.addEventListener('input', () => {
    const volume = volumeController.value / 100;
    audioOfTheGame.forEach(audio => {
        audio.volume = volume;
    });
});
