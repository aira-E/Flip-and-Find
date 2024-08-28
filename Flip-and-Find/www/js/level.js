document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let flips = 0;
let maxFlips = 50;
let round = 1;

let jsonFiles = [
  { file: "../json/cards.json", maxFlips: 50 },
  { file: "../json/pokemon.json", maxFlips: 40 },
  { file: "../json/emoji.json", maxFlips: 30 }
];
let currentJson = jsonFiles[0].file; // Start with the first JSON file

document.querySelector(".score").textContent = score;
document.querySelector(".cardflip").textContent = flips;

// Initial load
loadCards(currentJson);

function loadCards(jsonFile) {
  fetch(jsonFile)
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data]; // Duplicate the array to create pairs
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
  gridContainer.innerHTML = ""; // Clear previous cards

  for (let i = 0; i < 16; i++) { // Ensure only 16 cards are generated
    const card = cards[i];
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  flips++;
  document.querySelector(".cardflip").textContent = flips;

  if (flips >= maxFlips) {
    setTimeout(() => {
      alert("Game Over! You've reached the maximum number of flips.");
      resetGame(true);
    }, 500);
    return;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    score++;
    document.querySelector(".score").textContent = score;
    if (score % 8 === 0) { // Check if all pairs are found in the current round
      if (round < jsonFiles.length) {
        setTimeout(() => {
          alert(`Congratulations! You've matched all pairs in round ${round}!`);
          nextRound();
        }, 500);
      } else {
        setTimeout(() => {
          alert("Congratulations! You've completed all rounds!");
          resetGame(false); // Reset the game completely
        }, 500);
      }
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

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
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function nextRound() {
  round++;
  currentJson = jsonFiles[round - 1].file;
  maxFlips = jsonFiles[round - 1].maxFlips;
  resetGame(false);
}

function resetGame(isGameOver) {
  flips = 0;
  if (isGameOver) {
    score = 0; // Reset score if it's game over
    round = 1;
    currentJson = jsonFiles[0].file;
    maxFlips = jsonFiles[0].maxFlips;
  }
  document.querySelector(".score").textContent = score;
  document.querySelector(".cardflip").textContent = flips;
  loadCards(currentJson); // Reload cards from the current JSON file
}

function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}
