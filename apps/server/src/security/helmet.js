const helmet = require("helmet");
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://maps.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://accounts.google.com",
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://accounts.google.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "data:",
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://maps.googleapis.com",
        "https://accounts.google.com",
        "https://*.firebaseio.com",
        "wss://*.firebaseio.com",
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com",
        "https://accounts.google.com",
        "https://maps.googleapis.com",
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  dnsPrefetchControl: {
    allow: false,
  },
  // Deny framing outright; no embedding requirement exists for this origin.
  frameguard: {
    action: "deny",
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  xssFilter: true,
  crossOriginEmbedderPolicy: false, // Allow embedded resources
  crossOriginOpenerPolicy: {
    policy: "same-origin-allow-popups",
  },
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
};
module.exports = helmet(helmetConfig);
