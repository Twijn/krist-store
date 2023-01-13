const express = require("express");
const router = express.Router();

const con = require("../database");

const homepage = require("./homepage");
const product = require("./product/");
const shop = require("./shop/");
const account = require("./account/");
const login = require("./login");

const api = require("../api/");

router.use((req, res, next) => {
    req.user = null;
    if (req.cookies?.session) {
        con.query("select user_id from session where session.id = ?;", [req.cookies.session], async (err, result) => {
            if (err) {
                console.error(err);
            } else {
                if (result.length > 0) {
                    try {
                        req.user = await api.getUser(result[0].user_id);
                    } catch(err) {
                        console.error(err);
                    }
                } else {
                    res.cookie("session", null);
                }
            }
            next();
        });
    } else {
        next();
    }
});

router.use(homepage);
router.use("/product", product);
router.use("/shop", shop);
router.use("/account", account);

router.use("/login", login);

module.exports = router;