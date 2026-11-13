'use strict';

const LOGIN_ATTEMPT_TTL_DAYS = 30;
const SECURITY_EVENT_TTL_DAYS = 90;
const SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function cutoff(days) {
  return new Date(Date.now() - days * DAY_MS);
}

async function sweepOnce() {
  const { models } = require('../models');
  const { Op } = require('sequelize');
  const { cleanupSessions } = require('../lib/session');
  if (models.LoginAttempt) {
    await models.LoginAttempt.destroy({
      where: { attemptedAt: { [Op.lt]: cutoff(LOGIN_ATTEMPT_TTL_DAYS) } },
    });
  }
  if (models.SecurityEvent) {
    await models.SecurityEvent.destroy({
      where: { createdAt: { [Op.lt]: cutoff(SECURITY_EVENT_TTL_DAYS) } },
    });
  }
  await cleanupSessions();
}

function startRetention() {
  if (process.env.NODE_ENV === 'test') return null;
  sweepOnce().catch((err) =>
    console.error('[RETENTION] initial sweep failed:', err.message),
  );
  const timer = setInterval(() => {
    sweepOnce().catch((err) =>
      console.error('[RETENTION] sweep failed:', err.message),
    );
  }, SWEEP_INTERVAL_MS);
  if (timer.unref) timer.unref();
  return timer;
}

module.exports = { startRetention, sweepOnce };
