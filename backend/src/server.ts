const http = require("node:http") as typeof import("node:http");
const dotenv = require("dotenv") as typeof import("dotenv");
const { createApp } = require("./app") as { createApp: () => import("express").Express };

dotenv.config({ path: require("node:path").join(__dirname, ".env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const NODE_ENV = process.env.NODE_ENV ?? "development";
const PORT = Number.parseInt(requireEnv("PORT"), 10);

if (!Number.isFinite(PORT) || PORT <= 0) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}

const app = createApp();
const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[AGEIX] Server listening on port ${PORT} (${NODE_ENV})`);
});

function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`[AGEIX] Received ${signal}. Shutting down...`);
  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error("[AGEIX] Error during shutdown:", err);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log("[AGEIX] Shutdown complete.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

