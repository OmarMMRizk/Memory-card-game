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



const startGame = (level) => 
    {let cardNum;
        if(level==="easy"){
            cardNum=12;
        }  else if(level==="medium"){
            cardNum=16;
        } else if(level==="hard"){
            cardNum=20;
        }
        const gameLevel=[...gameCards.slice(0,cardNum/2),...gameCards.slice(0,cardNum/2)];
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
        }
        );
    }
let levelBtn = document.querySelectorAll('.level')
levelBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        startGame(e.target.value);
    })
})

const audioOfTheGame =document.querySelectorAll('audio');
const valumeControler = document.getElementById('sound-valume');

valumeControler.addEventListener('input',()=>{
const volume = valumeControler.value/100;
    audioOfTheGame.forEach(audio=>{
        audio.volume = volume;
    })
}
)
