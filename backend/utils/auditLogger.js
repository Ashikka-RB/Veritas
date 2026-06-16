const AuditLog = require("../models/AuditLog");
const Device = require("../models/Device");

function parseUserAgent(userAgent) {
  if (!userAgent) {
    return { browser: "Unknown Browser", os: "Unknown OS", deviceType: "Desktop" };
  }
  
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "Desktop";

  const ua = userAgent.toLowerCase();

  // OS Detection
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
    deviceType = "Mobile";
  }
  else if (ua.includes("android")) {
    os = "Android";
    deviceType = "Mobile";
  }
  else if (ua.includes("linux")) os = "Linux";

  // Browser Detection
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") || ua.includes("crios")) browser = "Chrome";
  else if (ua.includes("firefox") || ua.includes("fxios")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")) browser = "Safari";

  return { browser, os, deviceType };
}

function getIpAddress(req) {
  if (!req) return "127.0.0.1";
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || "127.0.0.1";
  // Clean IPv6 loopback
  if (rawIp === "::1" || rawIp === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }
  return rawIp.split(',')[0].trim();
}

const logSecurityEvent = async (userId, eventType, req, status, details = "") => {
  try {
    const userAgent = req ? req.headers["user-agent"] : "";
    const { browser, os, deviceType } = parseUserAgent(userAgent);
    const ipAddress = getIpAddress(req);

    const log = new AuditLog({
      userId: userId || null,
      eventType,
      status,
      details,
      ipAddress,
      browser,
      os,
      deviceType,
      location: (ipAddress === "127.0.0.1" || ipAddress === "localhost") ? "Localhost" : "Chennai, IN"
    });

    await log.save();
    console.log(`[AuditLog] Logged event: ${eventType} (${status})`);
    return log;
  } catch (error) {
    console.error("[AuditLog] Failed to write security log:", error);
  }
};

const registerDevice = async (userId, req) => {
  try {
    if (!userId || !req) return;
    const userAgent = req.headers["user-agent"] || "";
    const { browser, os, deviceType } = parseUserAgent(userAgent);
    const ipAddress = getIpAddress(req);

    // Look for existing device record
    const existing = await Device.findOne({
      userId,
      browser,
      os,
      deviceType
    });

    if (existing) {
      existing.ipAddress = ipAddress;
      existing.lastSeenAt = new Date();
      await existing.save();
      console.log(`[Device] Registered existing device lastSeen updated for User: ${userId}`);
      return existing;
    }

    const device = new Device({
      userId,
      browser,
      os,
      deviceType,
      ipAddress
    });

    await device.save();
    console.log(`[Device] Registered new device for User: ${userId}`);
    return device;
  } catch (error) {
    console.error("[Device] Failed to register device:", error);
  }
};

module.exports = {
  logSecurityEvent,
  registerDevice,
  parseUserAgent,
  getIpAddress
};
