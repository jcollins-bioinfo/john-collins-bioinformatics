/** Cloudflare Worker entry point for the production site. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

const CANONICAL_HOST = "johnpatrickcollins.info";
const FIGURE_THREE_RELEASE_ZIP_PATH =
  "/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised_v1.zip";
const FIGURE_THREE_RELEASE_ZIP_BYTES = 72_565_683;
const FIGURE_THREE_RELEASE_ZIP_SHA256 =
  "c54503486663c217ddd6348ccef22642255c04112ff936ab615c9e104449987d";
const FIGURE_THREE_RELEASE_TRANSPORT_PARTS = [
  {
    pathname: "/_cgt/f3/c54503486663c217/p1",
    bytes: 25_165_824,
  },
  {
    pathname: "/_cgt/f3/c54503486663c217/p2",
    bytes: 25_165_824,
  },
  {
    pathname: "/_cgt/f3/c54503486663c217/p3",
    bytes: 22_234_035,
  },
] as const;
const FIGURE_THREE_RELEASE_TRANSPORT_PATHS = new Set<string>(
  FIGURE_THREE_RELEASE_TRANSPORT_PARTS.map((part) => part.pathname),
);
const RELEASE_ASSET_CONTENT_TYPES = new Map([
  [
    "/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised.pdf",
    "application/pdf",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_002_recurrent_geometry_revised_v1.zip",
    "application/zip",
  ],
  [
    "/research/cgt/figures/main/figure-02-recurrent-geometry.pdf",
    "application/pdf",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised.pdf",
    "application/pdf",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_003_signed_axes_revised_v1.zip",
    "application/zip",
  ],
  [
    "/research/cgt/figures/main/figure-03-signed-axes.pdf",
    "application/pdf",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_web.png",
    "image/png",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_600dpi.png",
    "image/png",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised.pdf",
    "application/pdf",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised.svg",
    "image/svg+xml",
  ],
  [
    "/research/cgt/figures/main/CGT_FIGURE_004_dependency_aware_synthesis_revised_v1.zip",
    "application/zip",
  ],
]);

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

async function serveFigureThreeReleaseZip(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const partBodies: ReadableStream[] = [];
  for (const part of FIGURE_THREE_RELEASE_TRANSPORT_PARTS) {
    const partUrl = new URL(part.pathname, request.url);
    const partResponse = await env.ASSETS.fetch(new Request(partUrl, { method: request.method }));
    const contentLength = partResponse.headers.get("Content-Length");

    if (
      partResponse.status !== 200
      || (contentLength !== null && contentLength !== String(part.bytes))
      || (request.method === "GET" && !partResponse.body)
    ) {
      await Promise.all(partBodies.map((body) => body.cancel()));
      return new Response("Figure 3 release transport is unavailable", {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (partResponse.body) partBodies.push(partResponse.body);
  }

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Disposition": "attachment; filename=\"CGT_FIGURE_003_signed_axes_revised_v1.zip\"",
    "Content-Length": String(FIGURE_THREE_RELEASE_ZIP_BYTES),
    "Content-Type": "application/zip",
    ETag: `\"sha256-${FIGURE_THREE_RELEASE_ZIP_SHA256}\"`,
    "X-Content-SHA256": FIGURE_THREE_RELEASE_ZIP_SHA256,
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") return new Response(null, { status: 200, headers });

  let partIndex = 0;
  let activeReader: ReadableStreamDefaultReader | null = null;
  const body = new ReadableStream({
    async pull(controller) {
      try {
        while (partIndex < partBodies.length) {
          activeReader ??= partBodies[partIndex].getReader();
          const result = await activeReader.read();
          if (result.done) {
            activeReader.releaseLock();
            activeReader = null;
            partIndex += 1;
            continue;
          }
          controller.enqueue(result.value);
          return;
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel(reason) {
      if (activeReader) await activeReader.cancel(reason);
      await Promise.all(
        partBodies.slice(partIndex + (activeReader ? 1 : 0)).map((stream) => stream.cancel(reason)),
      );
    },
  });

  return new Response(body, { status: 200, headers });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url, 308);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === FIGURE_THREE_RELEASE_ZIP_PATH) {
      return serveFigureThreeReleaseZip(request, env);
    }

    if (FIGURE_THREE_RELEASE_TRANSPORT_PATHS.has(url.pathname)) {
      return new Response("Not Found", { status: 404 });
    }

    const releaseContentType = RELEASE_ASSET_CONTENT_TYPES.get(url.pathname);
    if (releaseContentType && env?.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        const headers = new Headers(response.headers);
        headers.set("Content-Type", releaseContentType);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
