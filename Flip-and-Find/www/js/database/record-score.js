["deviceready", "DOMContentLoaded"].forEach((event) => {
    document.addEventListener(event, onDeviceReady, false);
});


export function recordScore() {
    // TODO
    const newScore = document.querySelector("");
    const supabaseClient = initSupabase();

    (async () => {
        await saveScore(supabaseClient, newScore);
        recordScore();
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

async function saveScore(supabaseClient, newScore) {
    // TODO: update DB
}
