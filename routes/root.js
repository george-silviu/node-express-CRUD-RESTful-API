const express = require("express");
const router = express.Router();
const path = require("path");

//serving index.html page from views
//we can add on this page instructions about API
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
