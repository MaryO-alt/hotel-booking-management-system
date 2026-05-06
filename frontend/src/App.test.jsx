import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the hotel booking management system title", async () => {
  render(<App />);
  const title = await screen.findByText(/Hotel Booking Management System/i);
  expect(title).toBeInTheDocument();
});

test("renders the create booking section", async () => {
  render(<App />);
  const heading = await screen.findByText(/Create Booking/i);
  expect(heading).toBeInTheDocument();
});

test("renders the booking records area", async () => {
  render(<App />);
  const searchInput = await screen.findByPlaceholderText(/Search by guest, email or room/i);
  expect(searchInput).toBeInTheDocument();
});