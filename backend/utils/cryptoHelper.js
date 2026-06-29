const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not defined");
  }
  // Hash the key using sha256 to ensure it is exactly 32 bytes
  return crypto.createHash("sha256").update(key).digest();
};

const encrypt = (text) => {
  if (!text || text === "Not Found") return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return iv.toString("hex") + ":" + encrypted;
};

const decrypt = (text) => {
  if (!text || text === "Not Found") return text;
  
  // legacy fallback for plain text numbers
  if (!text.includes(":")) {
    return text;
  }
  
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};
