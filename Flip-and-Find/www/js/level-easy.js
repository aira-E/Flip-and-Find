document.addEventListener('deviceready', onDeviceReady, false);

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;  
let flips = 0;
let maxFlips = 50;
let round = 1;

function disableFormById(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const button = form.querySelector('button');
        if (button) {
            button.disabled = true;
        }
    }
}

function enableFormById(formId) {
  const form = document.getElementById(formId);
  if (form) {
      const button = form.querySelector('button');
      if (button) {
          button.disabled = false;
      }
  }
}

disableFormById('medium_button');
disableFormById('difficult_button');

let jsonFiles = [
    { file: "../json/cards.json", maxFlips: 50 },
];
let currentJson = jsonFiles[0].file; 

document.querySelector(".score").textContent = score;
document.querySelector(".cardflip").textContent = maxFlips;

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
    flips++;
    document.querySelector(".cardflip").textContent = maxFlips - flips;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
      score += 10;
      document.querySelector(".score").textContent = score;
      disableCards();
  } else {
      unflipCards();
  }

  if (flips >= maxFlips) {
      setTimeout(() => {
          alert("Game Over! You've used all your flips.");
          resetGame(true);
      }, 1000); 
  }

  if (score === 80) {
    enableFormById('medium_button');  
    setTimeout(() => {
        showCongratulatoryAlert();
    }, 1000); 
  }
}

/**function showCongratulatoryAlert() {
  const message = `
      <div style="text-align: center; padding: 20px;">
          <h2>Congratulations!</h2>
          <p>You've passed the easy level!</p>
          <a href="../html/default-game.html" style="display: inline-block; margin-top: 10px; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Continue</a>
      </div>
  `;
  const modal = document.createElement('div');
  modal.classList.add('custom-alert');
  modal.innerHTML = message;

  document.body.appendChild(modal);

  modal.addEventListener('click', () => {
      modal.remove();
  });
} **/

function showCongratulatoryAlert() {
    const modal = document.querySelector('.custom-alert');
    const overlay = document.querySelector('.custom-alert-overlay');

    // Show the modal and the overlay
    modal.style.display = 'block';
    overlay.style.display = 'block';

    // Close the modal when clicking on the overlay
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
        round = 1;
        currentJson = jsonFiles[0].file;
        maxFlips = jsonFiles[0].maxFlips;
    }
    document.querySelector(".score").textContent = score;
    document.querySelector(".cardflip").textContent = maxFlips;
    gridContainer.innerHTML = ""; 
    loadCards(currentJson); 
}

// On device ready
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
