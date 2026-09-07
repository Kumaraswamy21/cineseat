"use client";

import { useEffect } from "react";

/**
 * Runs axe-core in development and logs violations to the console.
 * Uses axe-core directly: @axe-core/react patches React.createElement and
 * throws on React 19 ESM modules.
 */
export function AxeDevTools() {
  useEffect(() => {
    let cancelled = false;

    void import("axe-core")
      .then(({ default: axe }) => {
        if (cancelled) return;

        axe.run(document, { reporter: "v2" }, (error, results) => {
          if (cancelled || error) return;

          if (results.violations.length === 0) {
            console.info("[axe] no accessibility violations found.");
            return;
          }

          console.group(
            `%c[axe] ${results.violations.length} accessibility violation(s)`,
            "color: #f87171",
          );
          for (const violation of results.violations) {
            console.groupCollapsed(
              `%c${violation.impact}: ${violation.help}`,
              "color: #f87171",
            );
            console.log(violation.helpUrl);
            for (const node of violation.nodes) {
              console.log(node.html, node.failureSummary);
            }
            console.groupEnd();
          }
          console.groupEnd();
        });
      })
      .catch((error: unknown) => {
        console.warn("[axe] dev-only checker did not start:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
