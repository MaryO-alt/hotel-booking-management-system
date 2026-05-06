import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost/hotel-booking-system/backend/api/bookings.php";

const emptyBooking = {
  guest_name: "",
  email: "",
  phone: "",
  room_type: "Standard",
  guests: 1,
  check_in: "",
  check_out: "",
  status: "Pending",
  notes: ""
};

function App() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyBooking);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      } else {
        setMessage("Could not load bookings.");
      }
    } catch (error) {
      setMessage("Could not connect to the PHP API.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.guest_name ||
      !form.email ||
      !form.phone ||
      !form.check_in ||
      !form.check_out
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}?id=${editingId}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (result.success) {
        setMessage(editingId ? "Booking updated successfully." : "Booking added successfully.");
        setForm(emptyBooking);
        setEditingId(null);
        fetchBookings();
      } else {
        setMessage(result.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Could not save booking. Check the PHP API.");
    }
  }

  function editBooking(booking) {
    setForm({
      guest_name: booking.guest_name,
      email: booking.email,
      phone: booking.phone,
      room_type: booking.room_type,
      guests: booking.guests,
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status,
      notes: booking.notes || ""
    });

    setEditingId(booking.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteBooking(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Booking deleted successfully.");
        fetchBookings();
      } else {
        setMessage(result.message || "Could not delete booking.");
      }
    } catch (error) {
      setMessage("Could not delete booking. Check the PHP API.");
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
        booking.email?.toLowerCase().includes(search.toLowerCase()) ||
        booking.room_type?.toLowerCase().includes(search.toLowerCase());

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
          <p>React frontend connected to PHP API and MySQL database</p>
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

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              name="guest_name"
              value={form.guest_name}
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

            <select name="room_type" value={form.room_type} onChange={handleChange}>
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
              name="check_in"
              value={form.check_in}
              onChange={handleChange}
              type="date"
            />

            <label>Check-out Date</label>
            <input
              name="check_out"
              value={form.check_out}
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
                      <h3>{booking.guest_name}</h3>
                      <p>{booking.email}</p>
                      <p>{booking.phone}</p>
                    </div>

                    <span className="status">{booking.status}</span>
                  </div>

                  <div className="booking-details">
                    <p><strong>Room:</strong> {booking.room_type}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                    <p><strong>Check-in:</strong> {booking.check_in}</p>
                    <p><strong>Check-out:</strong> {booking.check_out}</p>
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