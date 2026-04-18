const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");

router.get("/candidates", voteController.getCandidates);
router.post("/vote", authMiddleware, voteController.vote); // ✅ FIXED
router.get("/results", voteController.getResults);
router.get("/winner", voteController.getWinner);

module.exports = router;