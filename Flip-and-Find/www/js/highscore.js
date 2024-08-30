const HighScoringSystem = (() => {
    let db;
  
    // Initialize SQLite database and create HighScores table
    function initDatabase() {
      db = window.sqlitePlugin.openDatabase({ name: 'highscores.db', location: 'default' });
  
      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS HighScores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INTEGER)', [], function (tx, res) {
          console.log("Table created successfully");
        }, function (error) {
          console.log("Error creating table: " + error.message);
        });
      });
    }
  
    // Load and display the top 3 scores
    function loadTopScores(callback) {
      db.transaction(function (tx) {
        tx.executeSql('SELECT name, score FROM HighScores ORDER BY score DESC LIMIT 3', [], function (tx, res) {
          let topScores = [];
          for (let i = 0; i < res.rows.length; i++) {
            topScores.push({ name: res.rows.item(i).name, score: res.rows.item(i).score });
          }
          callback(topScores);
        }, function (error) {
          console.log("Error loading top scores: " + error.message);
        });
      });
    }
  
    // Save the score and name in the database, keeping only the top 3 scores
    function saveScore(name, score, callback) {
      db.transaction(function (tx) {
        tx.executeSql('INSERT INTO HighScores (name, score) VALUES (?, ?)', [name, score], function (tx, res) {
          tx.executeSql('DELETE FROM HighScores WHERE id NOT IN (SELECT id FROM HighScores ORDER BY score DESC LIMIT 3)', [], function (tx, res) {
            console.log("Score saved and top 3 maintained");
            callback();
          }, function (error) {
            console.log("Error maintaining top scores: " + error.message);
          });
        }, function (error) {
          console.log("Error saving score: " + error.message);
        });
      });
    }
  
    return {
      initDatabase,
      loadTopScores,
      saveScore
    };
  })();
  