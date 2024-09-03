document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;  
let flips = 0;
let maxFlips = 30;
let finalScore = 0;

const levelBackgrounds = {
    easy: "../json/basket.jpg",
    medium: "../json/pokeball.jpg",
    hard: "../json/omnitrix.jpg",
    custom: "../json/plain.jpg"
};

let currentLevel = "custom"; 

let jsonFiles = [
    { file: "../json/custom.json"},
];
let currentJson = jsonFiles[0].file; 

document.querySelector(".score").textContent = score;
document.querySelector(".cardflip").textContent = maxFlips;
document.querySelector(".finalscore").textContent = finalScore;

// Initial load
loadCards(currentJson);

function loadCards(jsonFile) {
    fetch(jsonFile)
        .then((res) => res.json())
        .then((data) => {
            cards = [...data, ...data]; 
            shuffleCards();
            generateCards();
        });
}

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="${card.image}" />
            </div>
            <div class="back" style="background-image: url(${levelBackgrounds[currentLevel]});"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    flips++;
    document.querySelector(".cardflip").textContent = maxFlips - flips;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
      score += 20;
      document.querySelector(".score").textContent = score;
      disableCards();
  } else {
      unflipCards();
  }

  if (flips >= maxFlips) {
    setTimeout(() => {
        FinalScore();
        const modal = document.querySelector('.custom-alert-gameover');
        const overlay = document.querySelector('.custom-alert-overlay');

        modal.style.display = 'block';
        overlay.style.display = 'block';

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                modal.style.display = 'none';
                overlay.style.display = 'none';
            }
        });
          resetGame(true);
      }, 1000); 
  }

  if (score === 160) {
    //enableFormById('medium_button');  
    setTimeout(() => {
        FinalScore();
        showCongratulatoryAlert();
    }, 1000); 
  }
}

function showCongratulatoryAlert() {
    const modal = document.querySelector('.custom-alert-congratulations');
    const overlay = document.querySelector('.custom-alert-overlay');

    modal.style.display = 'block';
    overlay.style.display = 'block';

    overlay.addEventListener('click', () => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    });
} 

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("scored");
    secondCard.classList.add("scored");

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function resetGame(isGameOver) {
    flips = 0;
    if (isGameOver) {
        score = 0; 
        //round = 1;
        currentJson = jsonFiles[0].file;
        maxFlips = jSsonFiles[0].maxFlips;
    }
    document.querySelector(".score").textContent = score;
    document.querySelector(".cardflip").textContent = maxFlips;
    gridContainer.innerHTML = ""; 
    loadCards(currentJson); 
}

function FinalScore() {
    const flipsLeft = maxFlips - flips;
    const finalScore = score + (flipsLeft * 10); // Adds 10 points per flip left
    document.querySelector(".finalscore").textContent = finalScore;
}

// On device ready
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
