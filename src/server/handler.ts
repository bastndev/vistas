import { normalizeSlug, type ViewsAdapter } from "../shared/types.js";
import { renderCountSvg, type SvgOptions } from "./svg.js";

export interface RouteHandlerOptions {
  /**
   * Path prefix in front of the slug, used when reading the slug from the URL
   * (frameworks that pass a raw `Request`, e.g. Next.js). Default `"/api/views"`.
   * Astro users get the slug from route params, so this rarely matters.
   */
  basePath?: string;
  /** Styling for the badge SVG returned in badge mode. */
  svg?: SvgOptions;
}

/** A raw web `Request`, or an Astro-style context carrying one. */
type HandlerInput =
  | Request
  | { request: Request; params?: Record<string, string | string[] | undefined> };

interface Resolved {
  slug: string;
  wantSvg: boolean;
}

function toContext(input: HandlerInput): {
  request: Request;
  params?: Record<string, string | string[] | undefined>;
} {
  if (input && typeof input === "object" && "request" in input) {
    return { request: input.request, params: input.params };
  }
  return { request: input as Request };
}

function resolveRequest(input: HandlerInput, options: RouteHandlerOptions): Resolved {
  const { request, params } = toContext(input);
  const basePath = options.basePath ?? "/api/views";

  const param = params?.slug;
  let raw = Array.isArray(param) ? param.join("/") : param ?? "";

  if (!raw) {
    const path = new URL(request.url).pathname;
    raw = path.startsWith(basePath)
      ? path.slice(basePath.length)
      : path.split("/").filter(Boolean).pop() ?? "";
  }

  raw = decodeURIComponent(raw.replace(/^\/+/, ""));

  let wantSvg = raw.endsWith(".svg");
  if (wantSvg) raw = raw.slice(0, -4);
  if (!wantSvg) {
    wantSvg = (request.headers.get("accept") ?? "").includes("image/svg+xml");
  }

  return { slug: normalizeSlug(raw), wantSvg };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function svgResponse(count: number, svg?: SvgOptions): Response {
  return new Response(renderCountSvg(count, svg), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

/**
 * Build `GET` / `POST` handlers for a per-slug views route (e.g. Astro's
 * `[...slug].ts` or a Next.js route handler).
 *
 * - `POST`  → increment, return `{ slug, count }`.
 * - `GET`   → read count, return `{ slug, count }`.
 * - Badge mode (`.svg` suffix or `Accept: image/svg+xml`): a `GET` increments
 *   and returns an SVG, since an `<img>` can only issue a `GET`.
 *
 * ```ts
 * const views = createViews(createUpstashAdapter());
 * export const { GET, POST } = createRouteHandlers(views);
 * ```
 */
export function createRouteHandlers(
  views: ViewsAdapter,
  options: RouteHandlerOptions = {}
) {
  async function GET(input: HandlerInput): Promise<Response> {
    try {
      const { slug, wantSvg } = resolveRequest(input, options);
      if (wantSvg) {
        const count = await views.increment(slug);
        return svgResponse(count, options.svg);
      }
      const count = await views.get(slug);
      return jsonResponse({ slug, count });
    } catch (err) {
      return jsonResponse({ error: (err as Error).message }, 500);
    }
  }

  async function POST(input: HandlerInput): Promise<Response> {
    try {
      const { slug, wantSvg } = resolveRequest(input, options);
      const count = await views.increment(slug);
      return wantSvg ? svgResponse(count, options.svg) : jsonResponse({ slug, count });
    } catch (err) {
      return jsonResponse({ error: (err as Error).message }, 500);
    }
  }

  return { GET, POST };
}

/**
 * Build a `GET` handler that returns the full ranking, newest-highest first.
 * Wire it to a dedicated route (e.g. `api/views/ranking.ts`) for a private
 * stats page. Supports `?limit=N`.
 *
 * ```ts
 * export const { GET } = createRankingHandler(views);
 * ```
 */
export function createRankingHandler(views: ViewsAdapter) {
  async function GET(input: HandlerInput): Promise<Response> {
    try {
      const { request } = toContext(input);
      const limitParam = new URL(request.url).searchParams.get("limit");
      const limit = limitParam ? Number(limitParam) : undefined;
      const ranking = await views.getRanking(
        Number.isFinite(limit) ? limit : undefined
      );
      return jsonResponse(ranking);
    } catch (err) {
      return jsonResponse({ error: (err as Error).message }, 500);
    }
  }

  return { GET };
}
