document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let flips = 0; // New variable to track flips
const maxFlips = 5; // Maximum allowed flips

document.querySelector(".score").textContent = score;
document.querySelector(".cardflip").textContent = flips; // Display flips count

fetch("../json/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data]; // Duplicating the array to have 16 cards (8 pairs)
    shuffleCards();
    generateCards();
  });

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
  gridContainer.innerHTML = ""; // Clear previous cards if any

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

  flips++; // Increment flip count
  document.querySelector(".cardflip").textContent = flips; // Update flips display

  if (flips >= maxFlips) { // Check if flips exceed maximum allowed
    setTimeout(() => {
      alert("Game Over! You've reached the maximum number of flips.");
      resetGame(); // Reset game or handle game over
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
    if (score === 8) { // Check if all pairs are found
      setTimeout(() => {
        alert("Congratulations! You've matched all pairs!");
        resetGame(); // Reset game or handle game won
      }, 500);
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

function resetGame() {
  flips = 0;
  score = 0;
  document.querySelector(".score").textContent = score;
  document.querySelector(".cardflip").textContent = flips;
  shuffleCards();
  generateCards();
}

function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}
