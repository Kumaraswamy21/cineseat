"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_SEATS = 4;

export async function bookSeats(
  seatIds: string[],
): Promise<{ ok: boolean; message: string }> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return { ok: false, message: "Sign in before booking a seat." };
  }

  const uniqueIds = [...new Set(seatIds)];

  if (uniqueIds.length === 0) {
    return { ok: false, message: "Select at least one seat, then book." };
  }

  if (uniqueIds.length > MAX_SEATS) {
    return {
      ok: false,
      message: `You can book at most ${MAX_SEATS} seats at a time.`,
    };
  }

  const seats = await prisma.seat.findMany({
    where: { id: { in: uniqueIds } },
  });

  if (seats.length !== uniqueIds.length) {
    return { ok: false, message: "One of those seats no longer exists." };
  }

  const showtimeIds = new Set(seats.map((seat) => seat.showtimeId));
  if (showtimeIds.size !== 1) {
    return { ok: false, message: "All selected seats must be for the same showing." };
  }

  const showtimeId = seats[0]!.showtimeId;

  try {
    await prisma.$transaction(async (tx) => {
      for (const seat of seats) {
        const claimed = await tx.seat.updateMany({
          where: { id: seat.id, status: "available" },
          data: { status: "booked" },
        });

        if (claimed.count !== 1) {
          throw new Error("SEAT_TAKEN");
        }

        await tx.booking.create({
          data: {
            seatId: seat.id,
            showtimeId: seat.showtimeId,
            userEmail: email,
          },
        });
      }
    });
  } catch {
    return {
      ok: false,
      message:
        "One of those seats was taken a moment ago. Your selection was not booked. Pick again.",
    };
  }

  revalidatePath(`/showtimes/${showtimeId}`);
  revalidatePath("/");

  const labels = seats
    .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
    .map((seat) => `${seat.row}${seat.number}`)
    .join(", ");

  return {
    ok: true,
    message: `Booked ${labels}. Enjoy the film.`,
  };
}
