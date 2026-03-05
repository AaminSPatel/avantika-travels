"use client";

import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarSection({ bookings }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const bookingDates = useMemo(() => {
    return bookings.map((b) =>
      new Date(b.travelDate).toDateString()
    );
  }, [bookings]);

  const selectedBookings = bookings.filter(
    (b) =>
      new Date(b.travelDate).toDateString() ===
      selectedDate.toDateString()
  );

  return (
    <div className="bg-white p-4 rounded-2xl shadow sm:w-auto w-[300px]">
      <h2 className="font-semibold mb-3 text-sm">
        Booking Calendar
      </h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="custom-calendar rounded-2xl p-2"
         tileClassName={({ date, view }) => {
    if (view !== "month") return;

    const dateString = date.toDateString();
    const todayString = new Date().toDateString();

    if (dateString === todayString) {
      return "today-date";
    }

    if (bookingDates.includes(dateString)) {
      return "booking-date";
    }

    return null;
  }}
      />

      <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
        {selectedBookings.length === 0 ? (
          <p className="text-xs text-gray-500">
            No bookings
          </p>
        ) : (
          selectedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-gray-50 p-2 rounded-lg text-xs flex justify-between"
            >
              <span>{b.name}</span>
              <span className="font-semibold">
                ₹{b.totalPrice}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}