const express = require("express");
const router = express.Router();

const con = require("../../database");
const api = require("../../api/");

router.get("/", async (req, res) => {
    if (req.user) {
        let code = "<code invalid>";
        if (!req.user.minecraft.uuid) {
            try {
                const getCode = await con.pquery("select minecraft_link from user where discord_id = ?;", [req.user.discord.id]);

                if (getCode.length > 0 && getCode[0].minecraft_link !== null) {
                    code = getCode[0].minecraft_link;
                } else {
                    const generateCode = async () => {
                        code = con.generateRandomString(8);
                        let retrieve = con.pquery("select discord_id from user where minecraft_link = ?;", [code]);
                        if (retrieve.length > 0)
                            await generateCode();
                    }
                    await generateCode();
    
                    await con.pquery("update user set minecraft_link = ? where discord_id = ?;", [code, req.user.discord.id]);
                }
            } catch(err) {
                console.error(err);
            }
        }
        let shops = [];
        try {
            const getShops = await con.pquery("select id from shop where owner_id = ?;", [req.user.discord.id]);
            for (let i = 0; i < getShops.length; i++) {
                shops = [
                    ...shops,
                    await api.getShop(getShops[i].id),
                ]
            }
        } catch(err) {
            console.error(err);
        }
        res.render("pages/account/view", {user: req.user, code: code, shops: shops});
    } else {
        res.redirect("/login");
    }
})

module.exports = router;