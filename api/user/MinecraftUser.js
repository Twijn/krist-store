class MinecraftUser {

    /**
     * Minecraft user UUID
     * @type {string}
     */
    uuid;

    /**
     * Minecraft user name
     * @type {string}
     */
    username;

    constructor(uuid, username) {
        this.uuid = uuid;
        this.username = username;
    }

    getHeadRenderURI() {
        return `https://crafatar.com/renders/head/${this.uuid}`;
    }
}

module.exports = MinecraftUser;