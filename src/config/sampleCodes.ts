export const SAMPLE_CODES = {
  basic: `// Basic License & Greeting Logic
function verifyLicenseKey(user, key) {
  const secretSalt = "AUTH_SALT_99382";
  const expectedHash = "a7f920bc8e11";
  
  if (!user || !key) {
    console.error("Missing credentials");
    return false;
  }
  
  const token = key + ":" + secretSalt;
  console.log("Validating user session for: " + user);
  return token.length > 15;
}

const isAuthorized = verifyLicenseKey("dev_user", "sec-token-12345");
console.log("Access Granted: " + isAuthorized);
`,

  apiClient: `// API Client with sensitive endpoint signatures
class SecureApiClient {
  constructor(apiKey, baseUrl = "https://api.internal-service.local/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.retryCount = 3;
  }

  async sendTelemetry(eventType, payload) {
    const endpoint = this.baseUrl + "/telemetry/" + eventType;
    const headers = {
      "Authorization": "Bearer " + this.apiKey,
      "X-Client-Signature": "sig_" + Date.now(),
      "Content-Type": "application/json"
    };

    try {
      console.log("Dispatching secure packet to:", endpoint);
      // Mock network call
      return { status: 200, success: true, timestamp: Date.now() };
    } catch (err) {
      console.error("Transmission failed", err);
      throw err;
    }
  }
}

const client = new SecureApiClient("sk_live_9948291048");
client.sendTelemetry("USER_HEARTBEAT", { active: true });
`,

  algorithm: `// Control-flow intensive cryptography calculation
function calculateProofOfWork(difficulty, challenge) {
  let nonce = 0;
  const targetPrefix = "0".repeat(difficulty);
  
  while (nonce < 1000000) {
    let hash = 0;
    const combined = challenge + "-" + nonce;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const hexHash = Math.abs(hash).toString(16);
    if (hexHash.startsWith(targetPrefix)) {
      return { nonce, hexHash, verified: true };
    }
    nonce++;
  }
  
  return { nonce: -1, verified: false };
}

const proof = calculateProofOfWork(2, "node-block-8392");
console.log("Proof solved:", proof);
`
};
