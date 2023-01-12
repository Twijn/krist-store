class DiscordUser {

    /**
     * Discord ID for this user
     * @type {string}
     */
    id;


    /**
     * Discord name for this user
     * @type {string}
     */
    name;

    /**
     * Discord discriminator fot his user
     * @type {string}
     */
    discriminator;

    /**
     * Discord user banner color
     * @type {string}
     */
    bannerColor;

    /**
     * Discord user avatar hash
     * @type {string}
     */
    avatar;

    constructor(id, name, discriminator, bannerColor, avatar) {
        this.id = id;
        this.name = name;
        this.discriminator = discriminator;
        this.bannerColor = bannerColor;
        this.avatar = avatar;
    }

    /**
     * Returns a full avatar URI for this user
     * @returns {string}
     */
    getAvatarURI() {
        return this.avatar ?
            `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png` :
            `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.png`
    }

    /**
     * Returns a DM link for this user
     * @returns {string}
     */
    getDMLink() {
        return `https://discord.com/channels/@me/${this.id}`;
    }
}

module.exports = DiscordUser;