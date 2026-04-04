const express = require('express');
const router = express.Router();
const { triggerEvent, retryDelivery } = require('../controllers/eventCtrl'); // <-- update import

router.post('/trigger', triggerEvent);
router.post('/retry/:logId', retryDelivery); // <-- add this route

module.exports = router;