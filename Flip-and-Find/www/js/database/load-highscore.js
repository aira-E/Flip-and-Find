["deviceready", "DOMContentLoaded"].forEach((event) => {
    document.addEventListener(event, onDeviceReady, false);
});

const highScoreTable = document.querySelector(".highscore-table > tbody");

function onDeviceReady() {
    const supabaseClient = initSupabase();

    (async () => {
        const topScores = await fetchTopScores(supabaseClient);
        renderTopScores(topScores);
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
        return;
    }
    console.log("High Scores Data:", data, data.length);
    return data;
}

function renderTopScores(scores) {
    console.log(scores);
    scores.forEach((data, index) => {
        const row = createTableRow(index + 1, data);
        highScoreTable.appendChild(row);
    });
}

function createTableRow(rank, data) {
    const tr = document.createElement('tr');

    const tdRank = document.createElement('td');
    tdRank.textContent = rank;
    tr.appendChild(tdRank);

    const tdScore = document.createElement('td');
    tdScore.textContent = data.score;
    tr.appendChild(tdScore);

    const tdDiff = document.createElement('td');
    tdDiff.textContent = data.difficulty;
    tr.appendChild(tdDiff);
    
    // // Uncomment to show date
    // const tdDate = document.createElement('td');
    // tdDate.textContent = convertToPrettyDate(data.achieved_at);
    // tr.appendChild(tdDate);
    return tr;
}

function convertToPrettyDate(dateString) {
    const dateObject = new Date(dateString);
    
    const prettyDate = dateObject.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    });
    return prettyDate;
    
}