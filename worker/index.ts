/** Cloudflare Worker entry point for the production site. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

const CANONICAL_HOST = "johnpatrickcollins.info";
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
