const express = require("express");
const router = new express.Router();
const path = require('path');

router.get("/update", async (req, res) => {
	res.sendFile(path.resolve("./static/update.json"));
});

module.exports = router;