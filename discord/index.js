// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("../config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Discord ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(config.discord.token);

module.exports = client;
