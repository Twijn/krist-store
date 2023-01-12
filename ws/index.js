const express = require("express");
const router = express.Router();

router.ws("/", (ws, req) => {
    ws.on("message", message => {
        ws.send(message);
    });
});

module.exports = router;