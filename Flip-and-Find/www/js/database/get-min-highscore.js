["deviceready", "DOMContentLoaded"].forEach((event) => {
  document.addEventListener(event, onDeviceReady, false);
});

const highScoreTable = document.querySelector(".highscore-table > tbody");

function onDeviceReady() {
  const supabaseClient = initSupabase();

  (async () => {
      const topScores = await fetchTopScores(supabaseClient);
      renderMinTopScore(topScores);
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

function renderMinTopScore(scores) {
  const minHighScore = document.querySelector(".min-high-score");
  const minTopScore = 0;
  if (scores.length <= 5) minTopsSores = scores.pop().score;
  console.log("MIN HIGH SCORE", minTopScore);
  minHighScore.innerText = minTopScore;
}
