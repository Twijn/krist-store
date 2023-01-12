const config = require("../config.json");
const con = require("../database");

const WebSocketClient = require("websocket").client;

const client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.error('Switchchat connect error: ' + error.toString());
    setTimeout(reconnect, 5000);
});

const reconnect = () => {
    client.connect(config.switchchat.domain + config.switchchat.secret);
}

client.on('connect', function(connection) {
    console.log('SwitchChat connected!');

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
        setTimeout(reconnect, 5000);
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
        setTimeout(reconnect, 5000);
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                const msg = JSON.parse(message.utf8Data);

                if (msg.type === "hello") {
                    console.log(`Using SwitchChat with token owner ${msg.licenseOwner} and capabilities: ${msg.capabilities}`);
                } else if (msg.type === "event" && msg.event === "command") {
                    if (msg.command.toLowerCase() === "klink") {
                        if (msg.args.length > 0) {
                            con.query("select * from user where minecraft_link = ?;", [msg.args[0]], (err, res) => {
                                if (err) {
                                    console.error(err);
                                    connection.send(JSON.stringify({
                                        type: "tell",
                                        user: msg.user.name,
                                        name: "krist.store",
                                        text: "An internal error occurred! Report this to <@267380687345025025>",
                                        mode: "markdown",
                                    }));
                                } else {
                                    if (res.length > 0) {
                                        con.query("update user set minecraft_link = null, minecraft_uuid = ?, minecraft_username = ? where discord_id = ?;", [
                                            msg.user.uuid,
                                            msg.user.name,
                                            res[0].discord_id,
                                        ], err => {
                                            if (err) console.error(err);
                                        });
                                        connection.send(JSON.stringify({
                                            type: "tell",
                                            user: msg.user.name,
                                            name: "krist.store",
                                            text: `Link successful! Nice to see you, <@${res[0].discord_id}>`,
                                            mode: "markdown",
                                        }));
                                    } else {
                                        connection.send(JSON.stringify({
                                            type: "tell",
                                            user: msg.user.name,
                                            name: "krist.store",
                                            text: "Invalid token. Request a new one at https://krist.store",
                                            mode: "markdown",
                                        }));
                                    }
                                }
                            });
                        } else {
                            connection.send(JSON.stringify({
                                type: "tell",
                                user: msg.user.name,
                                name: "krist.store",
                                text: "Not enough arguments! Requires a krist.store link token from https://krist.store",
                                mode: "markdown",
                            }));
                        }
                    }
                }
            } catch(err) {
                console.error(err);
            }
        }
    });
});

client.connect(config.switchchat.domain + config.switchchat.secret);
