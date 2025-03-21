const express = require('express');
const connectionController = require('../controllers/connection.Controller');
const router = express.Router();

router.post('/send-request', connectionController.sendRequest);
router.post('/accept-request', connectionController.acceptRequest);
router.delete('/reject-request/:requestId', connectionController.rejectRequest);
router.get('/get-requests', connectionController.getRequests);
router.get('/get-connections', connectionController.getConnections);

module.exports = router;