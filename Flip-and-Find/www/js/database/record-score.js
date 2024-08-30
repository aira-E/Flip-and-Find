["deviceready", "DOMContentLoaded"].forEach((event) => {
    document.addEventListener(event, onDeviceReady, false);
});


function onDeviceReady() {
    const numOfFlips = document.querySelector(".game_section .cardflip").innerText;
    let difficulty = '';
    numOfFlips >= 50 ? difficulty = "easy" : 
    numOfFlips >= 30 ? difficulty = "medium" :
    numOfFlips < 30 ? difficulty = "difficult" : null;

    const supabaseClient = initSupabase();
    listenToEndGame(supabaseClient, difficulty);
}

function initSupabase() {
    if (typeof CONFIG === "undefined" || 
        typeof CONFIG.SUPABASE_API_URL === "undefined" ||
        typeof CONFIG.SUPABASE_API_KEY === "undefined" ) {
        console.error(`ERROR: Supabase not initialized. \
            Ensure config.js exists and it contains url and key.`)
        return;
    }

    const supabaseUrl = CONFIG.SUPABASE_API_URL;
    const supabaseKey = CONFIG.SUPABASE_API_KEY;
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    return supabaseClient;
}

async function listenToEndGame(supabaseClient, difficulty) {
    // End game is detected by listening when modal (overlay) is shown, 
    // indicating that the game is cleared, over, or exited.
    const modalOverlay = document.querySelector(".custom-alert-overlay");
    const observer = new MutationObserver(async (mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' &&
                modalOverlay.classList.contains('shown')) {
                    // Check if top score modal is shown
                    const score = document.querySelector(".finalscore").innerText;
                    const modal = document.querySelector(".custom-alert.custom-alert-top-scorer");
                    if (modal.classList.contains('shown')) {
                        const continueBtn = modal.querySelector("a");
                        const nameInput = modal.querySelector("input");
                        console.log(continueBtn);
                        continueBtn.addEventListener("click", async () => {
                            await saveScore(supabaseClient, score, difficulty, nameInput.value);
                            window.location.href = '../../www/html/default-game.html';

                        });
                        return;
                    // If congratulation modal or game over modal
                    }
                    else {
                        await saveScore(supabaseClient, score, difficulty);
                    }
                        
            }
        }
    });
    observer.observe(modalOverlay, { attributes: true });
}

if (hasClasses(modalOverlay, 'shown', 'active')) {
    console.log('The modal overlay has both the "shown" and "active" classes.');
}

async function saveScore(supabaseClient, newScore, newDifficulty, name=null) {
    console.log(newScore, name);
    const { data, error } = await supabaseClient.rpc('record_score', {
        new_score: newScore,
        new_difficulty: newDifficulty,
    });

    if (error) {
        console.error("ERROR: Score is not updated.");
        console.error(error);
        return;
    }
    console.log("Score recorded");
}