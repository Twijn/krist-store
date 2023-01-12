const DiscordUser = require("./DiscordUser");
const MinecraftUser = require("./MinecraftUser");

class User {

    /**
     * Generated avatar URL for this user
     * @type {string}
     */
    avatar;

    /**
     * Discord user for this user
     * @type {DiscordUser}
     */
    discord;

    /**
     * Minecraft user for this user
     * @type {MinecraftUser}
     */
    minecraft;

    /**
     * Constructor for a User object
     * @param {DiscordUser} discord 
     * @param {MinecraftUser} minecraft 
     */
    constructor(discord, minecraft) {
        this.discord = discord;
        this.minecraft = minecraft;

        this.avatar = discord.getAvatarURI();
    }

}

module.exports = User;