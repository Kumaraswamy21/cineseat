import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/**
 * Read-only, so no confirmation gate.
 * SQLite `contains` is case-sensitive, so we filter in memory on this small grid.
 */
export const searchShowtimes = tool({
  description:
    "Search CineSeat showtimes by film name. Use this whenever the user asks " +
    "what is playing, when a film is on, or how many seats are left.",
  parameters: z.object({
    film: z
      .string()
      .optional()
      .describe("Part of a film title. Omit to list everything playing today."),
  }),
  execute: async ({ film }) => {
    const showtimes = await prisma.showtime.findMany({
      include: {
        seats: { where: { status: "available" }, select: { id: true } },
      },
      orderBy: { time: "asc" },
    });

    const needle = film?.trim().toLowerCase();
    const matched = needle
      ? showtimes.filter((showtime) =>
          showtime.film.toLowerCase().includes(needle),
        )
      : showtimes;

    return matched.slice(0, 10).map((showtime) => ({
      film: showtime.film,
      screen: showtime.screen,
      time: showtime.time.toISOString(),
      seatsAvailable: showtime.seats.length,
    }));
  },
});
