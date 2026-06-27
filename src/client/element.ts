import { trackView, type TrackOptions } from "./index.js";

export interface VistasCounterOptions {
  /** Custom tag name. Default `"vistas-counter"`. */
  tagName?: string;
  /** Default options applied to every element (overridable per-attribute). */
  defaults?: TrackOptions;
}

/**
 * Register the `<vistas-counter>` custom element. Framework-agnostic: drop it
 * into Astro, plain HTML, or any framework that renders DOM.
 *
 * ```html
 * <vistas-counter slug="blog">…</vistas-counter>
 * <script type="module">
 *   import { defineVistasCounter } from "vistas/element";
 *   defineVistasCounter();
 * </script>
 * ```
 *
 * Attributes: `slug` (required), `endpoint`, `cooldown`. The element sets its
 * text to the count; style it with regular CSS via the tag or a class. Safe to
 * call on the server — it no-ops when there's no DOM, and is idempotent.
 */
export function defineVistasCounter(options: VistasCounterOptions = {}): void {
  if (typeof customElements === "undefined" || typeof HTMLElement === "undefined") {
    return;
  }
  const tagName = options.tagName ?? "vistas-counter";
  if (customElements.get(tagName)) return;

  class VistasCounter extends HTMLElement {
    connectedCallback() {
      const slug = this.getAttribute("slug");
      if (!slug) return;

      const opts: TrackOptions = { ...options.defaults };
      const endpoint = this.getAttribute("endpoint");
      const cooldown = this.getAttribute("cooldown");
      if (endpoint) opts.endpoint = endpoint;
      if (cooldown) opts.cooldown = cooldown as TrackOptions["cooldown"];

      // Keep any author-provided placeholder until the real count arrives.
      if (this.textContent?.trim() === "") this.textContent = "…";

      void trackView(slug, opts).then((count) => {
        this.textContent = String(count);
        this.dispatchEvent(
          new CustomEvent("vistas:count", { detail: { slug, count }, bubbles: true })
        );
      });
    }
  }

  customElements.define(tagName, VistasCounter);
}
