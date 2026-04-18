const db = require("../db");

// ✅ Get candidates
exports.getCandidates = (req, res) => {
  db.query("SELECT * FROM candidates", (err, result) => {
    if (err) return res.send("Error ❌");
    res.json(result);
  });
};

// ✅ Vote
exports.vote = (req, res) => {
  const { voter_id, candidate_id } = req.body;

  db.query(
    "SELECT * FROM users WHERE voter_id = ?",
    [voter_id],
    (err, result) => {
      if (result.length === 0) {
        return res.send("User not found ❌");
      }

      const user = result[0];

      if (user.has_voted) {
        return res.send("You already voted ❌");
      }

      db.query(
        "INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)",
        [user.id, candidate_id],
        (err) => {
          if (err) return res.send("Vote error ❌");

          db.query(
            "UPDATE users SET has_voted = true WHERE id = ?",
            [user.id],
            (err) => {
              if (err) return res.send("Update error ❌");

              res.send("Vote cast successfully ✅");
            }
          );
        }
      );
    }
  );
};

// ✅ Results (IMPORTANT)
exports.getResults = (req, res) => {
  const query = `
    SELECT candidates.name, COUNT(votes.candidate_id) AS total_votes
    FROM candidates
    LEFT JOIN votes ON candidates.id = votes.candidate_id
    GROUP BY candidates.id
  `;

  db.query(query, (err, result) => {
    if (err) return res.send("Error ❌");
    res.json(result);
  });
};
exports.getWinner = (req, res) => {
  const query = `
    SELECT candidates.name, COUNT(votes.candidate_id) AS total_votes
    FROM candidates
    LEFT JOIN votes ON candidates.id = votes.candidate_id
    GROUP BY candidates.id
    ORDER BY total_votes DESC
    LIMIT 1
  `;

  db.query(query, (err, result) => {
    if (err) return res.send("Error ❌");
    res.json(result[0]);
  });
};