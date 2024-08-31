document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let flips = 0;
let maxFlips = 50;
let round = 1;

// Disabling other levels
function disableFormById(formId) {
  const form = document.getElementById(formId);
  if (form) {
      const button = form.querySelector('button');
      if (button) {
          button.disabled = true;
  }
}
}

disableFormById('medium_button');
disableFormById('difficult_button');

// Load the json file
let jsonFiles = [
  { file: "../json/cards.json", maxFlips: 50 },
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
  for (let card of cards) {
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

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
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
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// On device ready
function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}

/*

function nextRound() {
  round++; // Increment the round

  // Enable the "Medium" button when the user reaches round 2 or higher
  if (round >= 2) {
      const mediumButton = document.querySelector('#form-medium button');
      if (mediumButton) {
          mediumButton.disabled = false;
      }
  }

  // Logic for progressing to the next round
  if (round <= jsonFiles.length) {
      currentJson = jsonFiles[round - 1].file;
      maxFlips = jsonFiles[round - 1].maxFlips;
      resetBoard();
      loadCards(currentJson);
  } else {
      alert("No more rounds available!");
  }
}

function showRedirectButton() {
  // Create a new button element
  const button = document.createElement("button");
  button.textContent = "Go to Default Game";
  button.classList.add("redirect-button");
  button.addEventListener("click", () => {
      window.location.href = "default-game.html"; // Redirect to "default-game.html"
  });

  // Add the button to the body (or wherever you want it to appear)
  document.body.appendChild(button);
}

function resetGame(isGameOver) {
  flips = 0;
  if (isGameOver) {
      score = 0; // Reset score only if it's game over
      round = 1;
      currentJson = jsonFiles[0].file;
      maxFlips = jsonFiles[0].maxFlips;
  }
  document.querySelector(".score").textContent = score;
  document.querySelector(".cardflip").textContent = flips;
  loadCards(currentJson); // Reload cards from the current JSON file
}

**/


