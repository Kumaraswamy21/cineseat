export const SEAT_STATUSES = ["available", "selected", "booked"] as const;

export type SeatStatus = (typeof SEAT_STATUSES)[number];

export function toSeatStatus(value: string): SeatStatus {
  if ((SEAT_STATUSES as readonly string[]).includes(value)) {
    return value as SeatStatus;
  }

  throw new Error(`Invalid seat status: ${value}`);
}

/** Maps DB status to the union the Seat component understands. */
export function toSeatUiStatus(
  status: SeatStatus,
): "available" | "occupied" | "unavailable" {
  switch (status) {
    case "available":
    case "selected":
      return "available";
    case "booked":
      return "occupied";
  }
}
