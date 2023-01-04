const express = require("express");
const router = express.Router();

const homepage = require("./homepage");

router.use(homepage);

module.exports = router;