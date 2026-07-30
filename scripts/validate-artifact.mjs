import { access } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const workerPath = new URL("../dist/server/index.js", import.meta.url);

await access(workerPath);

const workerUrl = pathToFileURL(workerPath.pathname);
workerUrl.searchParams.set("artifact-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);

if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error(
    "dist/server/index.js must have an ESM default export with fetch(request, env, ctx)",
  );
}

console.log("Validated Cloudflare Worker artifact: ESM default.fetch is present.");
