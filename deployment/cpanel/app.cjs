const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { Readable } = require("node:stream");
const { pathToFileURL } = require("node:url");

const appRoot = __dirname;
const clientRoot = path.join(appRoot, "dist", "client");
const serverRoot = path.join(appRoot, "dist", "server");

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function cacheControl(filePath) {
  return filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=3600";
}

async function fetchAsset(request) {
  const url = new URL(request.url);
  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const filePath = path.resolve(clientRoot, relativePath);
  const resolvedClientRoot = path.resolve(clientRoot);
  const allowedRoot = `${resolvedClientRoot}${path.sep}`;

  if (filePath !== resolvedClientRoot && !filePath.startsWith(allowedRoot)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) return new Response("Not found", { status: 404 });

    const headers = new Headers({
      "Cache-Control": cacheControl(filePath),
      "Content-Length": String(stat.size),
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(Readable.toWeb(fs.createReadStream(filePath)), {
      status: 200,
      headers,
    });
  } catch (error) {
    if (error && error.code === "ENOENT") return new Response("Not found", { status: 404 });
    console.error("Static asset error", error);
    return new Response("Asset error", { status: 500 });
  }
}

const workerPromise = import(pathToFileURL(path.join(serverRoot, "index.js")).href).then(
  (module) => module.default,
);

function sendResponse(response, outgoing, method) {
  outgoing.statusCode = response.status;
  outgoing.statusMessage = response.statusText || outgoing.statusMessage;
  response.headers.forEach((value, name) => outgoing.setHeader(name, value));

  if (method === "HEAD" || !response.body) {
    outgoing.end();
  } else {
    Readable.fromWeb(response.body).pipe(outgoing);
  }
}

const server = http.createServer(async (incoming, outgoing) => {
  try {
    const protocol = incoming.headers["x-forwarded-proto"] || "https";
    const host = incoming.headers["x-forwarded-host"] || incoming.headers.host || "localhost";
    const url = new URL(incoming.url || "/", `${protocol}://${host}`);
    const method = incoming.method || "GET";
    const init = { method, headers: incoming.headers };

    if (method !== "GET" && method !== "HEAD") {
      init.body = Readable.toWeb(incoming);
      init.duplex = "half";
    }

    const request = new Request(url, init);
    if (method === "GET" || method === "HEAD") {
      const assetResponse = await fetchAsset(request);
      if (assetResponse.status !== 404) {
        sendResponse(assetResponse, outgoing, method);
        return;
      }
    }

    const worker = await workerPromise;
    const backgroundTasks = [];
    const context = {
      waitUntil(promise) {
        backgroundTasks.push(Promise.resolve(promise).catch(console.error));
      },
      passThroughOnException() {},
    };
    const env = { ...process.env, ASSETS: { fetch: fetchAsset } };
    const response = await worker.fetch(request, env, context);

    sendResponse(response, outgoing, method);

    if (backgroundTasks.length) void Promise.allSettled(backgroundTasks);
  } catch (error) {
    console.error("Request failed", error);
    if (!outgoing.headersSent) {
      outgoing.statusCode = 500;
      outgoing.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    outgoing.end("Internal server error");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Harmony Balaton Villa is ready.");
});

