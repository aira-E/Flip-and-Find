document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let roundComplete = false;

document.querySelector(".score").textContent = score;

fetch("../json/cards.json")
  .then((res) => res.json())
  .then((data) => {
    if (gridContainer.classList.contains("grid-6x6")) {
      cards = [...data.slice(0, 18), ...data.slice(0, 18)]; // Ensure 36 cards for 6x6 grid
    } else {
      cards = [...data.slice(0, 8), ...data.slice(0, 8)]; // For 4x4 grid, use only 16 cards
    }
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
  
    const cardCount = gridContainer.classList.contains("grid-6x6") ? 36 : 16; // Dynamically decide how many cards
    for (let i = 0; i < cardCount; i++) {
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

    // Check if the round is complete
    if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
      roundComplete = true;
      setTimeout(expandGrid, 1500); // Expand the grid after a short delay
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

function expandGrid() {
    if (roundComplete) {
      roundComplete = false;
      gridContainer.classList.add("grid-6x6"); // Add class to change grid size
  
      fetch("../json/cards.json")
        .then((res) => res.json())
        .then((data) => {
          cards = [...data, ...data]; // Assuming `data` has 18 unique cards
          shuffleCards();
          generateCards(); // Regenerate the cards
        });
    }
}
  

function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}
