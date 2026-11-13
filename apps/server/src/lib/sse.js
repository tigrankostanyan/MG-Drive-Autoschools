'use strict';
// Server-Sent Events manager for real-time session notifications.

// Process-local SSE registry; clustered deployments need Redis pub/sub instead.
const sseClients = new Map();

// Heartbeat interval to keep connections alive through proxies/load balancers
const HEARTBEAT_INTERVAL_MS = 25_000;
let heartbeatTimer = null;

function registerClient(userId, res, req) {
  if (!userId) return;

  // Close any existing SSE connection for this user (single-tab enforcement)
  const existing = sseClients.get(String(userId));
  if (existing && !existing.writableEnded) {
    try {
      existing.write(`data: ${JSON.stringify({ event: 'replaced' })}\n\n`);
      existing.end();
    } catch (_) { /* ignore if already closed */ }
  }

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
  res.flushHeaders();

  sseClients.set(String(userId), res);

  res.write(`data: ${JSON.stringify({ event: 'connected', userId: String(userId) })}\n\n`);

  const cleanup = () => sseClients.delete(String(userId));
  req.on('close',   cleanup);
  req.on('aborted', cleanup);
  res.on('finish',  cleanup);
  res.on('close',   cleanup);

  _ensureHeartbeat();
}

// Tells the old device its session was superseded by a new login.
function notifyKickedOut(userId) {
  _send(userId, { event: 'kicked_out' });
}


// Number of open SSE connections, used by health checks.
function clientCount() {
  return sseClients.size;
}

function _send(userId, payload) {
  const client = sseClients.get(String(userId));
  if (!client || client.writableEnded) {
    sseClients.delete(String(userId));
    return false;
  }
  try {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
    return true;
  } catch (err) {
    sseClients.delete(String(userId));
    return false;
  }
}

function _ensureHeartbeat() {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => {
    if (sseClients.size === 0) {
      // No clients, so stop the timer to avoid keeping the process alive
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      return;
    }
    for (const [uid, res] of sseClients) {
      if (res.writableEnded) {
        sseClients.delete(uid);
        continue;
      }
      try {
        // SSE comment line: invisible to onmessage, keeps TCP alive
        res.write(': heartbeat\n\n');
      } catch (_) {
        sseClients.delete(uid);
      }
    }
  }, HEARTBEAT_INTERVAL_MS);

  // Don't keep the process alive just for SSE heartbeats
  if (heartbeatTimer.unref) heartbeatTimer.unref();
}

module.exports = {
  registerClient,
  notifyKickedOut,
  clientCount,
};
