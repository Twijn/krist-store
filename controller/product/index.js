const express = require("express");
const router = express.Router();

router.get("/all", (req, res) => {
    res.render("pages/product/all", {user: req.user});
})

module.exports = router;