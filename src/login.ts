import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import axios from "axios";
import open from "open";
import { OAUTH_AUTH_ENDPOINT, OAUTH_TOKEN_ENDPOINT } from "./constants.js";
import { resolveApiKey } from "./op-fallback.js";
import { createPkcePair } from "./services/pkce.js";

// Make sure 1Password fallback runs if needed.
// The client secret is optional — the interactive flow uses PKCE.
resolveApiKey("SPROUT_CLIENT_ID", "op://Development/Sprout OAuth Client/client_id");
resolveApiKey("SPROUT_CLIENT_SECRET", "op://Development/Sprout OAuth Client/client_secret");

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const TOKEN_PATH = path.join(os.homedir(), ".sprout-mcp-auth.json");

async function runLogin() {
  let clientId = process.env.SPROUT_CLIENT_ID;
  // Client secret is OPTIONAL. With PKCE, a public client needs only a client ID.
  // If a secret is present (a confidential client), we still send it on exchange.
  const clientSecret = process.env.SPROUT_CLIENT_SECRET;

  // 1. Prompt for the client ID if it is missing.
  if (!clientId) {
    console.log("\n🔑 Sprout OAuth Client ID not found in environment or 1Password.");
    console.log("Enter your Sprout OAuth Client ID (from Sprout Settings > Global Features > API).");
    console.log("No client secret is required for interactive login — this flow uses PKCE.\n");

    const rl = readline.createInterface({ input, output });
    try {
      clientId = (await rl.question("Enter Sprout OAuth Client ID: ")).trim();
    } catch (err: any) {
      console.error("\n❌ Error reading input:", err.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  if (!clientId) {
    console.error("\n❌ Error: a Client ID is required to log in.\n");
    process.exit(1);
  }

  // PKCE: prove we initiated the flow without shipping a secret.
  const { verifier, challenge } = createPkcePair();
  const state = crypto.randomBytes(16).toString("hex");

  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || "", true);

    if (parsedUrl.pathname === "/callback") {
      const code = parsedUrl.query.code;
      const receivedState = parsedUrl.query.state;

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Authentication Failed</h1><p>No authorization code received.</p>");
        return;
      }

      if (receivedState !== state) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Authentication Failed</h1><p>State mismatch error. Request may have been compromised.</p>");
        return;
      }

      try {
        // Exchange code for tokens
        const params = new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: REDIRECT_URI,
          client_id: clientId!,
          code_verifier: verifier,
        });
        // Confidential clients (a secret was provided) also send it.
        // Public/PKCE clients omit it — the code_verifier proves the exchange.
        if (clientSecret) {
          params.set("client_secret", clientSecret);
        }

        const response = await axios.post(OAUTH_TOKEN_ENDPOINT, params.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Save tokens AND client credentials so the server can run zero-config
        const tokenData = {
          client_id: clientId,
          client_secret: clientSecret,
          access_token,
          refresh_token,
          expires_at: Date.now() + (expires_in || 3600) * 1000,
        };

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2), "utf-8");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Login Successful</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f7f9fa; }
              .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: inline-block; max-width: 500px; }
              h1 { color: #2ecc71; margin-top: 0; }
              p { color: #555; font-size: 16px; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✓ Login Successful!</h1>
              <p>You have successfully authenticated with Sprout Social.</p>
              <p>You can close this browser tab and return to the terminal. The Sprout MCP server will now be able to use your personal account.</p>
            </div>
          </body>
          </html>
        `);

        console.log("\n✅ Login successful! Config and tokens saved to:", TOKEN_PATH);
        
        // Stop the server and exit
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);

      } catch (error: any) {
        console.error("\n❌ Failed to exchange authorization code:", error.response?.data || error.message);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>Authentication Failed</h1><p>Failed to exchange code for tokens. Error: ${error.message}</p>`);
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  server.listen(PORT, () => {
    const authUrl = `${OAUTH_AUTH_ENDPOINT}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20offline_access&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

    console.log(`\nStarting local authentication server on port ${PORT}...`);
    console.log("Opening your browser to authenticate with Sprout Social...");
    console.log("\nIf your browser doesn't open automatically, visit this URL:");
    console.log(authUrl);
    console.log("\nWaiting for authentication callback...");

    open(authUrl).catch((err) => {
      console.error("⚠️ Failed to automatically open browser. Please use the URL above.", err.message);
    });
  });
}

runLogin().catch((err) => {
  console.error("Fatal error during login:", err);
  process.exit(1);
});
