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
document.querySelector(".cardflip").textContent = maxFlips;

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
    flips++;
    document.querySelector(".cardflip").textContent = maxFlips - flips;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        // Increase score by 10 points for each matched pair
        score += 10;
        document.querySelector(".score").textContent = score;
        disableCards();
    } else {
        unflipCards();
    }

    // Check for game over
    if (flips >= maxFlips) {
        setTimeout(() => {
            alert("Game Over! You've used all your flips.");
            resetGame(true);
        }, 1000); // Give time for the last flip to be processed
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
    firstCard = null;
    secondCard = null;
    lockBoard = false;
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
    document.querySelector(".cardflip").textContent = maxFlips;
    gridContainer.innerHTML = ""; // Clear the grid container
    loadCards(currentJson); // Reload cards from the current JSON file
}

// On device ready
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
