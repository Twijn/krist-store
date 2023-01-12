const express = require("express");
const router = express.Router();

const con = require("../../database");
const api = require("../../api/");
const config = require("../../config.json");

const bodyParser = require("body-parser");

const LINK_REGEX = /^[a-z0-9]+$/;
const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const ADDRESS_REGEX = /^k[a-z0-9]{9}$/;
const NAME_REGEX = /^[a-z0-9]+.kst$/;
const NAME_WITH_META_REGEX = /^[A-Za-z0-9]+@[a-z0-9]+.kst$/;

router.get("/all", (req, res) => {
    res.render("pages/shop/all", {user: req.user});
});

router.get("/add", (req, res) => {
    if (req.user) {
        res.render("pages/shop/add", {user: req.user, domain: config.domain.replace("http://", "").replace("https://", "")});
    } else {
        res.redirect("/login");
    }
});

router.get("/check", (req, res) => {
    if (req.query.hasOwnProperty("link")) {
        con.query("select * from shop where link = ?;", [req.query.link], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ok: false, error: "A SQL error occurred"});
            } else {
                res.json({ok: true, available: result.length === 0});
            }
        });
    } else {
        res.json({ok: false, error: "No valid parameters were supplied"});
    }
});

router.get("/:link", (req, res) => {
    api.getShopByLink(req.params.link).then(async shop => {
        res.render("pages/shop/view", {user: req.user, shop: shop, products: await shop.getProducts()});
    }, err => {
        console.error(err);
        res.send("An unexpected error occurred!");
    });
});

router.get("/:link/edit", (req, res) => {
    api.getShopByLink(req.params.link).then(shop => {
        if (req.user.discord.id === shop.owner.discord.id) {
            res.render("pages/shop/edit", {user: req.user, shop: shop});
        } else {
            res.redirect("/shop/all");
        }
    }, err => {
        console.error(err);
        res.send("An unexpected error occurred!");
    });
});

router.use(bodyParser.urlencoded({ extended: false }));

router.post("/add", async (req, res) => {
    const {body} = req;

    if (!req.user) {
        res.redirect("/login");
        return;
    }

    let ok = true;
    let errors = {};

    if (body.name && body.name.length >= 3) {
        if (body.name.length > 64) {
            ok = false;
            errors.name = "Field must be less than 64 characters";
        }
    } else {
        ok = false;
        errors.name = "Field must be at least 3 characters";
    }

    if (body.link && body.link.length >= 3) {
        if (body.link.length <= 16) {
            if (LINK_REGEX.test(body.link)) {
                const getLink = await con.pquery("select id from shop where link = ?;", [body.link]);

                if (getLink.length > 0) {
                    ok = false;
                    errors.link = "Link already exists";
                }
            } else {
                ok = false;
                errors.link = "Field must only contain lowercase characters (a-z) and numbers (0-9)";
            }
        } else {
            ok = false;
            errors.link = "Field must be less than 16 characters";
        }
    } else {
        ok = false;
        errors.link = "Field must be at least 3 characters";
    }

    if (body.tagline) {
        if (body.tagline.length > 128) {
            ok = false;
            errors.tagline = "Field must be less than 128 characters";
        }
    } else {
        body.tagline = "";
    }

    if (body.themeColor) {
        if (!COLOR_REGEX.test(body.themeColor)) {
            ok = false;
            errors.themeColor = "Invalid hex color code. Examples: #fff, #ffffff";
        }
    } else {
        ok = false;
        errors.themeColor = "Field does not exist";
    }

    if (body.payoutAddress) {
        if (!ADDRESS_REGEX.test(body.payoutAddress)
            && !NAME_REGEX.test(body.payoutAddress)
            && !NAME_WITH_META_REGEX.test(body.payoutAddress)) {
            ok = false;
            errors.payoutAddress = "Invalid payout address. Examples: twijn.kst, twijn@switchcraft.kst, kktwijnope";
        }
    } else {
        ok = false;
        errors.payoutAddress = "Field does not exist";
    }

    if (body.kristName) {
        if (body.kristName !== "" && !NAME_REGEX.test(body.kristName)) {
            ok = false;
            errors.kristName = "Krist name must either be empty or be a valid Krist name, such as twijn.kst";
        }
    } else {
        body.kristName = "";
    }

    if (body.payoutFrequency) {
        if (body.payoutFrequency === "payout") {
            if (body.payoutSetpoint) {
                body.payoutSetpoint = Number(body.payoutSetpoint);
                if (!isNaN(body.payoutSetpoint)) {
                    if (body.payoutSetpoint <= 0 || body.payoutSetpoint % 1 !== 0) {
                        ok = false;
                        errors.payoutFrequency = "Payout setpoint must be an integer greater than 0";
                    }
                } else {
                    ok = false;
                    errors.payoutFrequency = "Payout setpoint is not a number";
                }
            } else {
                ok = false;
                errors.payoutFrequency = "Payout setpoint does not exist";
            }
        } else if (body.payoutFrequency !== "transaction" && body.payoutFrequency !== "daily") {
            ok = false;
            errors.payoutFrequency = "Invalid frequency value. Allowed values: payout, transaction, daily";
        }
    } else {
        ok = false;
        errors.payoutFrequency = "Field does not exist";
    }

    if (ok) {
        con.query("insert into shop (link, owner_id, kristName, tagline, name, themeColor, payoutAddress, payoutFrequency, payoutSetpoint) values (?, ?, ?, ?, ?, ?, ?, ?, ?);", [
            body.link,
            req.user.discord.id,
            body.kristName,
            body.tagline,
            body.name,
            body.themeColor,
            body.payoutAddress,
            body.payoutFrequency,
            body.payoutFrequency === "payout" ? body.payoutSetpoint : null,
        ], err => {
            if (err) {
                console.error(err);
                res.send("An unexpected error occurred. Try again");
            } else {
                res.redirect(`/shop/${encodeURI(body.link)}/edit`);
            }
        });
    } else {
        res.render("pages/shop/add", {user: req.user, domain: config.domain.replace("http://", "").replace("https://", ""), errors: errors, values: body});
    }
});

module.exports = router;