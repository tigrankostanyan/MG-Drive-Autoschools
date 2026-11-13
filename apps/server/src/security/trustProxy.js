const trustProxy = () => {
  if (process.env.NODE_ENV === "production") {
    return ["loopback", "linklocal", "uniquelocal"];
  }
  return ["loopback"];
};
const getClientIP = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips.find((ip) => !isPrivateIP(ip)) || ips[0];
  }
  if (realIP) return realIP;
  return req.ip || req.connection.remoteAddress;
};
const isPrivateIP = (ip) => {
  const privateRanges = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
  ];
  return privateRanges.some((range) => range.test(ip));
};
module.exports = {
  trustProxy,
  getClientIP,
  isPrivateIP,
};
