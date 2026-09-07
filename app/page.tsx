import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";
import { FilmPoster } from "@/components/film-poster";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatShowtime(time: Date) {
  return time.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function Home() {
  const showtimes = await prisma.showtime.findMany({
    orderBy: { time: "asc" },
  });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Today&apos;s showtimes</h1>
          <p className="muted">Pick a film, then choose your seat.</p>
        </div>
        <AuthButtons redirectTo="/" />
      </div>

      {showtimes.length === 0 ? (
        <p className="notice">
          No showtimes yet. Run <code>npm run db:migrate</code> then{" "}
          <code>npm run db:seed</code>.
        </p>
      ) : (
        <ul className="showtime-list">
          {showtimes.map((showtime) => (
            <li key={showtime.id}>
              <Link href={`/showtimes/${showtime.id}`} className="showtime-card">
                <FilmPoster film={showtime.film} />
                <div className="showtime-card__body">
                  <strong>{showtime.film}</strong>
                  <span className="muted">
                    Screen {showtime.screen} · {formatShowtime(showtime.time)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
