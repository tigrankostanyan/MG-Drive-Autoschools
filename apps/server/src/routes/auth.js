'use strict';
const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authenticate');
const { suspiciousSessionDetector } = require('../middleware/rateLimiter');
const { mfaChallengeLimiter } = require('../utils/limiter');
const mfaController = require('../controllers/mfa');
const { registerClient } = require('../lib/sse');

/* MFA second step: redeems the body-carried mfaToken; rate-limited. */
router.post('/mfa/challenge', mfaChallengeLimiter, mfaController.challenge);

router.get(
  '/sse/session',
  authenticate,
  suspiciousSessionDetector,
  (req, res) => {
    registerClient(req.user.id, res, req);
    // Keep the request open; do not call next() or end().
  },
);

module.exports = router;
