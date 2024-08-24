document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 30;
    const timerSpan = document.querySelector('.timer');

    function updateTimer() {
        if (timeLeft > 0) {
            timerSpan.textContent = `${timeLeft} s`;
            timeLeft--;
        } else if (timeLeft === 0) {
            timerSpan.textContent = "Time's up!";
            timeLeft--; // Decrement to -1 to trigger the alert on the next call
        } else {
            clearInterval(timerInterval);
            checkGameOver();
        }
    }

    function checkGameOver() {
        const allCards = document.querySelectorAll('.card');
        const allFlipped = [...allCards].every(card => card.classList.contains('flipped'));

        if (!allFlipped) {
            alert("Time's up! Game Over.");
            lockBoard = true; // Stop further interaction with the board
        } else {
            timerSpan.textContent = "You Win!";
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call to display the timer immediately
});
