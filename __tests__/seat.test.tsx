import { fireEvent, render, screen } from "@testing-library/react";
import { Seat } from "@/components/Seat";

describe("Seat", () => {
  it("announces row, number and status", () => {
    render(<Seat row="D" number={4} status="available" />);
    expect(
      screen.getByRole("button", { name: "Row D, seat 4, available" }),
    ).toBeInTheDocument();
  });

  it("marks occupied seats as disabled while keeping their status in the label", () => {
    render(<Seat row="D" number={4} status="occupied" />);
    const seat = screen.getByRole("button", { name: "Row D, seat 4, occupied" });

    expect(seat).toBeDisabled();
  });

  it("does not select an occupied seat", () => {
    const onClick = jest.fn();
    render(
      <Seat row="D" number={4} status="occupied" onClick={onClick} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /occupied/ }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("selects an available seat", () => {
    const onClick = jest.fn();
    render(
      <Seat row="A" number={1} status="available" onClick={onClick} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /available/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
