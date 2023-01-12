const express = require("express");
const router = express.Router();

router.get("/all", (req, res) => {
    res.render("pages/item/all", {user: req.user});
})

module.exports = router;