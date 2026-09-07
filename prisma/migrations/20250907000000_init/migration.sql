-- CreateTable
CREATE TABLE "Showtime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "film" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "screen" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "showtimeId" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    CONSTRAINT "Seat_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "showtimeId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Seat_showtimeId_idx" ON "Seat"("showtimeId");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_showtimeId_row_number_key" ON "Seat"("showtimeId", "row", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_seatId_key" ON "Booking"("seatId");

-- CreateIndex
CREATE INDEX "Booking_userEmail_idx" ON "Booking"("userEmail");

-- CreateIndex
CREATE INDEX "Booking_showtimeId_idx" ON "Booking"("showtimeId");
