const express = require("express");
const router = express.Router();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const config = require("../config.json");
const con = require("../database");
const DISCORD_AUTH = `https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientId}&redirect_uri=${encodeURIComponent(config.domain + "login")}&response_type=code&scope=identify%20guilds.join`;

const discordClient = require("../discord/");

const getToken = async (code) => {
    const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: config.discord.clientId,
            client_secret: config.discord.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: config.domain + "login",
            scope: 'identify',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return await oauthResult.json();
}
    
const getUser = async (accessToken, tokenType) => {
    const userResult = await fetch('https://discord.com/api/users/@me', {
        method: 'GET',
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    });
    return await userResult.json();
}

const stringGenerator = (length = 32) => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

router.get("/", async (req, res) => {
    const { query } = req;
	const { code } = query;

	if (code) {
		try {
			const oauthData = await getToken(code);
            const user = await getUser(oauthData.access_token, oauthData.token_type);

            if (user.hasOwnProperty("message") && user.message === "401: Unauthorized")  {
                res.redirect(DISCORD_AUTH);
                return;
            }
            
            discordClient.guilds.fetch(config.discord.guildId).then(guild => {
                guild.members.add(user.id, {accessToken: oauthData.access_token}).then(member => {
                    con.query("insert into user (discord_id, discord_name, discord_discriminator, discord_bannercolor, discord_avatar) values (?, ?, ?, ?, ?) on duplicate key update discord_name = ?, discord_discriminator = ?, discord_bannercolor = ?, discord_avatar = ?;", [
                        user.id,
                        user.username,
                        user.discriminator,
                        user.banner_color,
                        user.avatar,
                        user.username,
                        user.discriminator,
                        user.banner_color,
                        user.avatar,
                    ], async err => {
                        if (err) {
                            console.error(err);
                            res.send("An error occurred. Send this to Twijn#8888");
                        } else {
                            try {
                                let session = stringGenerator(32);
                                
                                while (true) {
                                    let result = await con.pquery("select id from session where id = ?;", [session]);
                                    if (result.length > 0) {
                                        session = stringGenerator(32);
                                    } else break;
                                }
    
                                await con.pquery("insert into session (id, user_id) values (?, ?);", [session, user.id]);
                                
                                res.cookie("session", session);
                                res.redirect("/");
                            } catch (err) {
                                console.error(err);
                                res.send("An error occurred. Send this to Twijn#8888");
                            }
                        }
                    });
                }, err => {
                    console.error(err);
                    res.send("An error occurred. Send this to Twijn#8888");
                })
            }, err => {
                console.error(err);
                res.send("An error occurred. Send this to Twijn#8888");
            });
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
            res.json({success: false, error: "An error occurred"});
		}
	} else {
        res.redirect(DISCORD_AUTH);
    }
})

module.exports = router;