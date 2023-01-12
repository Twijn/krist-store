const con = require("../database");

const Shop = require("./shop/");

const User = require("./user/");
const DiscordUser = require("./user/DiscordUser");
const MinecraftUser = require("./user/MinecraftUser");

const Location = require("./obj/Location");
const PayoutInformation = require("./obj/PayoutInformation");

class API {
    /**
     * Gets a shop via shop ID
     * @param {number} id 
     * @returns {Promise<Shop>}
     */
    getShop(id) {
        return new Promise((resolve, reject) => {
            con.query("select * from shop where id = ?;", [id],async (err, res) => {
                if (!err) {
                    if (res.length > 0) {
                        let shop = res[0];
                        resolve(new Shop(
                            shop.id,
                            shop.link,
                            await this.getUser(shop.owner_id),
                            shop.kristName,
                            shop.tagline,
                            shop.name,
                            shop.x ? new Location(
                                shop.x,
                                shop.y,
                                shop.z
                            ) : null,
                            shop.themeColor,
                            shop.remote == 1,
                            shop.dispense == 1,
                            new PayoutInformation(
                                shop.payoutAddress,
                                shop.payoutFrequency,
                                shop.payoutSetpoint
                            )
                        ));
                    } else {
                        reject("Shop not found");
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Gets a shop via shop link
     * @param {string} link 
     * @returns {Promise<Shop>}
     */
    getShopByLink(link) {
        return new Promise((resolve, reject) => {
            con.query("select id from shop where link = ?;", [link], (err, res) => {
                if (!err) {
                    if (res.length > 0) {
                        this.getShop(res[0].id).then(resolve, reject);
                    } else {
                        reject("Shop not found");
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Gets a user by discord ID
     * @param {string} discordId
     * @returns {Promise<User>}
     */
    getUser(discordId) {
        return new Promise((resolve, reject) => {
            con.query("select * from user where discord_id = ?;", [discordId], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.length > 0) {
                        let user = res[0];
                        resolve(new User(
                            new DiscordUser(
                                user.discord_id,
                                user.discord_name,
                                user.discord_discriminator,
                                user.discord_bannercolor,
                                user.discord_avatar
                            ),
                            new MinecraftUser(
                                user.minecraft_uuid,
                                user.minecraft_username
                            )
                        ));
                    } else {
                        reject("User not found");
                    }
                }
            });
        });
    }
}

module.exports = new API();