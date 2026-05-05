import { useMemo, useState } from "react";
import "./App.css";

const emptyBooking = {
  guestName: "",
  email: "",
  phone: "",
  roomType: "Standard",
  guests: 1,
  checkIn: "",
  checkOut: "",
  status: "Pending",
  notes: ""
};

function App() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      guestName: "John Smith",
      email: "john@example.com",
      phone: "07123456789",
      roomType: "Deluxe",
      guests: 2,
      checkIn: "2026-05-10",
      checkOut: "2026-05-13",
      status: "Confirmed",
      notes: "Late check-in requested"
    },
    {
      id: 2,
      guestName: "Mary Johnson",
      email: "mary@example.com",
      phone: "07987654321",
      roomType: "Suite",
      guests: 3,
      checkIn: "2026-05-15",
      checkOut: "2026-05-18",
      status: "Pending",
      notes: "Needs airport pickup"
    }
  ]);

  const [form, setForm] = useState(emptyBooking);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.guestName || !form.email || !form.phone || !form.checkIn || !form.checkOut) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      setBookings(
        bookings.map((booking) =>
          booking.id === editingId ? { ...form, id: editingId } : booking
        )
      );
      setEditingId(null);
    } else {
      const newBooking = {
        ...form,
        id: Date.now()
      };
      setBookings([newBooking, ...bookings]);
    }

    setForm(emptyBooking);
  }

  function editBooking(booking) {
    setForm(booking);
    setEditingId(booking.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteBooking(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      setBookings(bookings.filter((booking) => booking.id !== id));
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
        booking.email.toLowerCase().includes(search.toLowerCase()) ||
        booking.roomType.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Hotel Booking Management System</h1>
          <p>Manage guest reservations, rooms and booking status</p>
        </div>
      </header>

      <section className="hero">
        <h2>Hotel Booking Dashboard</h2>
        <p>
          This web application allows hotel staff to create, view, update,
          search, filter and delete hotel booking records.
        </p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h3>{totalBookings}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="stat-card">
          <h3>{confirmedBookings}</h3>
          <p>Confirmed</p>
        </div>

        <div className="stat-card">
          <h3>{pendingBookings}</h3>
          <p>Pending</p>
        </div>
      </section>

      <main className="main-layout">
        <section className="form-section">
          <h2>{editingId ? "Update Booking" : "Create Booking"}</h2>
          <p className="small-text">Enter guest and reservation details below.</p>

          <form onSubmit={handleSubmit}>
            <input
              name="guestName"
              value={form.guestName}
              onChange={handleChange}
              placeholder="Guest full name *"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address *"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number *"
            />

            <select name="roomType" value={form.roomType} onChange={handleChange}>
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Executive</option>
              <option>Suite</option>
              <option>Family Room</option>
            </select>

            <input
              name="guests"
              value={form.guests}
              onChange={handleChange}
              type="number"
              min="1"
              placeholder="Number of guests"
            />

            <label>Check-in Date</label>
            <input
              name="checkIn"
              value={form.checkIn}
              onChange={handleChange}
              type="date"
            />

            <label>Check-out Date</label>
            <input
              name="checkOut"
              value={form.checkOut}
              onChange={handleChange}
              type="date"
            />

            <select name="status" value={form.status} onChange={handleChange}>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Checked In</option>
              <option>Checked Out</option>
              <option>Cancelled</option>
            </select>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes"
            />

            <button type="submit">
              {editingId ? "Save Changes" : "Add Booking"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyBooking);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="records-section">
          <div className="records-header">
            <div>
              <h2>Booking Records</h2>
              <p className="small-text">Search and manage saved reservations.</p>
            </div>
          </div>

          <div className="filters">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by guest, email or room"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Checked In</option>
              <option>Checked Out</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="booking-list">
            {filteredBookings.length === 0 ? (
              <p className="no-record">No booking records found.</p>
            ) : (
              filteredBookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <div className="booking-top">
                    <div>
                      <h3>{booking.guestName}</h3>
                      <p>{booking.email}</p>
                      <p>{booking.phone}</p>
                    </div>

                    <span className="status">{booking.status}</span>
                  </div>

                  <div className="booking-details">
                    <p><strong>Room:</strong> {booking.roomType}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                    <p><strong>Check-in:</strong> {booking.checkIn}</p>
                    <p><strong>Check-out:</strong> {booking.checkOut}</p>
                  </div>

                  {booking.notes && (
                    <p className="notes">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  )}

                  <div className="actions">
                    <button onClick={() => editBooking(booking)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBooking(booking.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;