/**
 * Server entry. Holds the secret Redis token and exposes the route handlers a
 * user wires into their framework. Never import this from client code.
 */

export {
  createUpstashAdapter,
  type UpstashAdapterOptions,
} from "./adapters/upstash.js";

export {
  createRouteHandlers,
  createRankingHandler,
  type RouteHandlerOptions,
} from "./handler.js";

export { renderCountSvg, type SvgOptions } from "./svg.js";

export type {
  ViewsAdapter,
  ViewResult,
  RankingEntry,
} from "../shared/types.js";
