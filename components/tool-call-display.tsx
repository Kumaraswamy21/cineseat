"use client";

import type { ToolInvocation } from "ai";

const LABELS: Record<string, string> = {
  searchShowtimes: "Checked the showtimes",
  cancelBooking: "Cancellation",
};

type CancelResult = { ok?: boolean; message?: string };

function formatToolResult(invocation: ToolInvocation): string | null {
  if (invocation.state !== "result") return null;

  if (invocation.toolName === "cancelBooking") {
    const result = invocation.result as CancelResult | undefined;
    return (
      result?.message ??
      (result?.ok ? "Booking cancelled." : "Cancellation did not complete.")
    );
  }

  if (invocation.toolName === "searchShowtimes") {
    const result = invocation.result;
    if (!Array.isArray(result)) return null;
    if (result.length === 0) return "No showtimes found.";
    return `Found ${result.length} showtime${result.length === 1 ? "" : "s"}.`;
  }

  return null;
}

export function ToolCallDisplay({ invocation }: { invocation: ToolInvocation }) {
  const label = LABELS[invocation.toolName] ?? invocation.toolName;
  const done = invocation.state === "result";
  const summary = formatToolResult(invocation);

  return (
    <div className="tool-call">
      <span className="tool-call__label">
        {done ? label : `${label}...`}
      </span>
      {summary && <p className="tool-call__summary">{summary}</p>}
    </div>
  );
}
