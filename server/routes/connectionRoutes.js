const express = require("express");
const { sendRequest, acceptRequest } = require("../controllers/connection.Controller");
const router = express.Router();

// Send a connection request
router.post("/send-request", sendRequest);

// Accept a connection request
router.post("/accept-request", acceptRequest);

module.exports = router;