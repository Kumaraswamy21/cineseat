"use client";

import type { ButtonHTMLAttributes } from "react";

export type SeatStatus = "available" | "occupied" | "unavailable";

export interface SeatProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-label" | "aria-pressed" | "type"
  > {
  row: string | number;
  number: number | string;
  status: SeatStatus;
  selected?: boolean;
}

function getStatusLabel(status: SeatStatus, selected: boolean): string {
  if (selected) {
    return "selected";
  }

  switch (status) {
    case "available":
      return "available";
    case "occupied":
      return "occupied";
    case "unavailable":
      return "unavailable";
  }
}

function getSeatAriaLabel(
  row: string | number,
  number: number | string,
  status: SeatStatus,
  selected: boolean,
): string {
  const statusLabel = getStatusLabel(status, selected);
  return `Row ${row}, seat ${number}, ${statusLabel}`;
}

export function Seat({
  row,
  number,
  status,
  selected = false,
  className,
  disabled,
  ...rest
}: SeatProps) {
  const isDisabled = disabled ?? status !== "available";
  const ariaPressed =
    !isDisabled && status === "available" ? selected : undefined;

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      aria-label={getSeatAriaLabel(row, number, status, selected)}
      aria-pressed={ariaPressed}
      className={[
        "inline-flex size-11 items-center justify-center rounded-md border-2 text-sm font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-foreground bg-foreground text-background"
          : status === "available"
            ? "border-foreground/30 bg-background text-foreground hover:border-foreground/60"
            : "border-foreground/15 bg-foreground/5 text-foreground/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true">{number}</span>
    </button>
  );
}
