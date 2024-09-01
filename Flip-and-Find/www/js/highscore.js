["deviceready", "DOMContentLoaded"].forEach((event) => {
    document.addEventListener(event, onDeviceReady, false);
});

function onDeviceReady() {
    const highscoreTable = document.querySelector(".highscore-table");
    const supabaseClient = initSupabase();
    console.log(highscoreTable, supabaseClient);
    highscoreTable.innerHTML = `<p>${supabaseClient ? "GUMANA" : "AYAW GUMANA"}</p>`;


    (async () => {
        const topScores = await fetchTopScores(supabaseClient);
    }) ();
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

async function fetchTopScores(supabaseClient) {
    const { data, error } = await supabaseClient.rpc('get_top_scores');
    if (error) {
        console.error("ERROR: High scores not fetched.");
        console.error(error);
    }
    else {
        console.log("High Scores Data:", data, data.length);
    }
}