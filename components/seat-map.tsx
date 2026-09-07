"use client";

import { useState, useTransition } from "react";
import { Seat } from "@/components/Seat";
import {
  toSeatUiStatus,
  type SeatStatus,
} from "@/lib/seat-status";

export type SeatData = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
};

type BookResult = { ok: boolean; message: string };

const MAX_SEATS = 4;

function SeatLegend() {
  return (
    <ul className="legend">
      <li>
        <span
          className="legend__swatch legend__swatch--available"
          aria-hidden="true"
        />
        Available
      </li>
      <li>
        <span
          className="legend__swatch legend__swatch--selected"
          aria-hidden="true"
        />
        Selected
      </li>
      <li>
        <span
          className="legend__swatch legend__swatch--booked"
          aria-hidden="true"
        />
        Booked
      </li>
    </ul>
  );
}

function seatLabel(seat: SeatData) {
  return `${seat.row}${seat.number}`;
}

export function SeatMap({
  seats,
  onBook,
  signedIn,
}: {
  seats: SeatData[];
  onBook: (seatIds: string[]) => Promise<BookResult>;
  signedIn: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();

  const rows = [...new Set(seats.map((seat) => seat.row))].sort();
  const selectedSeats = seats.filter((seat) => selectedIds.includes(seat.id));

  function toggleSeat(seat: SeatData) {
    if (seat.status !== "available" || isPending) return;

    setSelectedIds((current) => {
      if (current.includes(seat.id)) {
        return current.filter((id) => id !== seat.id);
      }

      if (current.length >= MAX_SEATS) {
        setAnnouncement(`You can select up to ${MAX_SEATS} seats.`);
        return current;
      }

      setAnnouncement(`Selected ${seatLabel(seat)}.`);
      return [...current, seat.id];
    });
  }

  function bookSelected() {
    if (selectedIds.length === 0 || isPending) return;

    startTransition(async () => {
      const result = await onBook(selectedIds);
      setAnnouncement(result.message);
      if (result.ok) {
        setSelectedIds([]);
      }
    });
  }

  const summary =
    selectedSeats.length === 0
      ? "No seats selected."
      : `Selected: ${selectedSeats.map(seatLabel).join(", ")}`;

  return (
    <section className="seat-map" aria-labelledby="seat-map-heading">
      <h2 id="seat-map-heading">Seat map</h2>
      <p className="muted">
        Click to select up to {MAX_SEATS} seats, then book.
      </p>
      <p className="screen-label">SCREEN</p>

      <div className="seat-rows" role="group" aria-label="Seat rows">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="seat-row__label" aria-hidden="true">
              {row}
            </span>
            {seats
              .filter((seat) => seat.row === row)
              .sort((a, b) => a.number - b.number)
              .map((seat) => {
                const isBooked = seat.status === "booked";
                const isSelected = selectedIds.includes(seat.id);
                const uiStatus = toSeatUiStatus(seat.status);

                return (
                  <Seat
                    key={seat.id}
                    row={seat.row}
                    number={seat.number}
                    status={uiStatus}
                    selected={isSelected}
                    disabled={isBooked}
                    className={
                      isBooked
                        ? "seat seat--booked"
                        : isSelected
                          ? "seat seat--selected"
                          : "seat"
                    }
                    onClick={() => toggleSeat(seat)}
                  />
                );
              })}
          </div>
        ))}
      </div>

      <SeatLegend />

      <p className="announcement" aria-live="polite">
        {announcement || summary}
      </p>

      <div className="seat-map__actions">
        <button
          type="button"
          className="button button--quiet"
          disabled={selectedIds.length === 0 || isPending}
          onClick={() => {
            setSelectedIds([]);
            setAnnouncement("Selection cleared.");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="button"
          disabled={selectedIds.length === 0 || isPending || !signedIn}
          onClick={bookSelected}
        >
          {isPending
            ? "Booking..."
            : signedIn
              ? `Book ${selectedIds.length} seat${selectedIds.length === 1 ? "" : "s"}`
              : "Sign in to book"}
        </button>
      </div>
    </section>
  );
}
