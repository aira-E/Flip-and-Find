["deviceready", "DOMContentLoaded"].forEach((event) => {
    document.addEventListener(event, onDeviceReady, false);
});


function onDeviceReady() {
    const cards = document.querySelectorAll(".grid-container > .card");
    const numOfFlips = document.querySelector(".game_section .cardflip").innerText;
    let difficulty = '';
    numOfFlips >= 50 ? difficulty = "easy" : 
    numOfFlips >= 30 ? difficulty = "medium" :
    numOfFlips < 30 ? difficulty = "difficult" : null;

    const supabaseClient = initSupabase();
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const score = document.querySelector(".game_section .score").textContent;
            console.log(score);
            shouldSave() ? saveScore(supabaseClient, score, difficulty) : null;
        })
    });
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

function shouldSave() {
    const cards = document.querySelectorAll(".grid-container > .card");
    const numOfUnscoredCards = document.querySelectorAll(".grid-container > .card.scored");
    console.log(numOfUnscoredCards.length, cards.length);
    if (numOfUnscoredCards.length !== cards.length) {
        return false;
    }
    return true;
}

async function saveScore(supabaseClient, newScore, newDifficulty) {
    console.log(newScore);
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