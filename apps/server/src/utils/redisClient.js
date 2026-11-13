const { createClient } = require("redis");
const isProduction = process.env.NODE_ENV === "production";
// Fail fast: a production deployment without a configured cache backend must
// not start silently on a degraded in-memory cache.
if (isProduction && !process.env.REDIS_SOCKET && !process.env.REDIS_URL) {
  console.error(
    "🔴 Production requires REDIS_SOCKET or REDIS_URL (rate limiting, cache). Set NODE_ENV=development to run without Redis.",
  );
  process.exit(1);
}
const mockClient = {
  store: new Map(),
  isOpen: true,
  async connect() {
    console.log("⚠️ Using In-Memory Cache (Redis fallback)");
  },
  async get(key) {
    return this.store.get(key);
  },
  async set(key, value, options = {}) {
    this.store.set(key, value);
    if (options.EX) {
      setTimeout(() => this.store.delete(key), options.EX * 1000);
    }
  },
  async del(key) {
    this.store.delete(key);
  },
  async flushAll() {
    this.store.clear();
  },
  async sAdd(key, value) {
    let set = this.store.get(key);
    if (!(set instanceof Set)) {
      set = new Set();
      this.store.set(key, set);
    }
    set.add(value);
  },
  async incr(key) {
    let value = this.store.get(key);
    value = Number(value) || 0;
    value++;
    this.store.set(key, value);
    return value;
  },
  async expire(key, seconds) {
    setTimeout(() => this.store.delete(key), seconds * 1000);
  },
  on() {},
};
const redisSocket = isProduction ? process.env.REDIS_SOCKET : null;
const redisUrl = isProduction ? process.env.REDIS_URL : null;
let realClient = null;
let activeClient = mockClient;
let rejectingLogged = false;
// In production a cache failure is never transparent: every operation fails
// until the real client reconnects, so rate limiting fails closed. Rejections
// are returned as promises (never thrown synchronously) so that callers using
// `redis.op().catch(...)` still receive the failure instead of crashing.
const rejectWhileDown = (err) => {
  if (!rejectingLogged) {
    rejectingLogged = true;
    console.error(
      "🔴 Redis down; cache operations fail until reconnected:",
      (err && err.message) || "not connected",
    );
  }
  return Promise.reject(new Error("Redis unavailable"));
};
const rejectingFallback = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "on") return () => {};
      return (...args) =>
        rejectWhileDown(args.find((a) => a instanceof Error) || null);
    },
  },
);
let fallbackLogged = false;
const logFallback = (err) => {
  if (fallbackLogged) return;
  fallbackLogged = true;
  console.warn("🟡 Redis unavailable, using fallback:", err && err.message);
};
if (redisSocket || redisUrl) {
  realClient = createClient({
    ...(redisUrl ? { url: redisUrl } : {}),
    socket: {
      ...(redisSocket ? { path: redisSocket } : {}),
      // Sync require() on Windows stalls the event loop; keep this timeout high.
      connectTimeout: 30000,
      // Keep retrying after the first failure instead of giving up.
      reconnectStrategy: (retries) => Math.min(retries * 250, 3000),
    },
  });
  // Production fails closed from the very first request: until "ready" fires,
  // operations reject instead of silently hitting the in-memory fallback.
  if (isProduction) {
    activeClient = rejectingFallback;
  }
  realClient.on("ready", () => {
    activeClient = realClient;
    rejectingLogged = false;
    fallbackLogged = false;
    console.log("🟢 Redis connected ✔————", redisUrl || redisSocket || "");
  });
  realClient.on("end", () => {
    if (isProduction && activeClient === realClient) {
      activeClient = rejectingFallback;
      console.error("🔴 Redis connection ended; failing closed until reconnected.");
    }
  });
  realClient.on("error", (err) => {
    if (activeClient === realClient) {
      console.error("🔴 Redis error:", err.message);
      return;
    }
    // Never throw inside an event handler (crashes the process); log once
    // while down. Operations themselves fail closed until "ready" fires.
    if (!rejectingLogged) {
      rejectingLogged = true;
      console.error("🔴 Redis down:", err && err.message);
    }
  });
}
const redis = new Proxy(
  {},
  {
    get(_, prop) {
      const client = activeClient || mockClient;
      if (typeof client[prop] === "function") {
        return client[prop].bind(client);
      }
      return client[prop];
    },
  },
);
(async () => {
  if (!realClient) {
    await mockClient.connect();
    return;
  }
  realClient.connect().catch((err) => {
    if (isProduction) {
      activeClient = rejectingFallback;
    }
    logFallback(err);
  });
})();
module.exports = redis;
