/**
 * vistaz — a tiny, framework-agnostic page-view counter.
 *
 * The default entry is the client core (zero dependencies). Other surfaces live
 * behind subpaths so you only pull what you use:
 *
 *   import { trackView, createTracker } from "vistaz";
 *   import { defineVistazCounter } from "vistaz/element";
 *   import { useViews } from "vistaz/react";
 *   import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";
 */

export { trackView, createTracker } from "./client/index.js";
export type { TrackOptions, Tracker } from "./client/index.js";
export type {
  Duration,
  StorageLike,
  ViewResult,
  RankingEntry,
} from "./shared/types.js";
