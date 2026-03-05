"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";

import UpcomingBookings from "./UpcomingBookings";
import CalendarSection from "./CalendarSection";
import StatCard from "./StatCard";
import AnalyticsChart from "./RevenueChart";
import { BookingStatusChart } from "./BookingStatusChart";

import { useSite } from "@/context/site-context";

export default function Dashboard() {
  const { bookings,packages, places, reviews, contacts } = useSite();

  // Demo bookings
/*   const bookings = [
    {
      id: "b1",
      customer: "Aarav Sharma",
      packageId: "p1",
      date: "2026-01-15",
      price: 25000,
      status: "confirmed",
    },
    {
      id: "b2",
      customer: "Zoya Khan",
      packageId: "p2",
      date: "2026-03-10",
      price: 18000,
      status: "confirmed",
    },
    {
      id: "b3",
      customer: "Rohan Verma",
      packageId: "p3",
      date: "2026-03-25",
      price: 22000,
      status: "pending",
    },
    {
      id: "b4",
      customer: "Mehak Ali",
      packageId: "p4",
      date: "2026-07-05",
      price: 30000,
      status: "cancelled",
    },
  ];
 */
  
  
  const [metric, setMetric] = useState("revenue");
  const [range, setRange] = useState("monthly");

  // ---- Analytics Data ----
  const analyticsData = useMemo(() => {
    if (!bookings) return [];

    // WEEKLY
    if (range === "weekly") {
      const days = Array(7)
        .fill(0)
        .map((_, i) => ({
          name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
          revenue: 0,
          bookings: 0,
          contacts: 0,
        }));

      bookings.forEach((b) => {
        const day = new Date(b.travelDate).getDay();
        days[day].bookings += 1;

        if (b.status === "confirmed") {
          days[day].revenue += Number(b.totalPrice);
        }
      });

      contacts?.forEach((c) => {
        const day = new Date(c.createdAt).getDay();
        days[day].contacts += 1;
      });

      return days;
    }

    // MONTHLY
    if (range === "monthly") {
      const months = Array(12)
        .fill(0)
        .map((_, i) => ({
          name: [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec",
          ][i],
          revenue: 0,
          bookings: 0,
          contacts: 0,
        }));

      bookings.forEach((b) => {
        const month = new Date(b.travelDate).getMonth();
        months[month].bookings += 1;

        if (b.status === "confirmed") {
          months[month].revenue += Number(b.totalPrice);
        }
      });

      contacts?.forEach((c) => {
        const month = new Date(c.createdAt).getMonth();
        months[month].contacts += 1;
      });

      return months;
    }

    // YEARLY
    if (range === "yearly") {
      const years = {};

      bookings.forEach((b) => {
        const year = new Date(b.travelDate).getFullYear();

        if (!years[year]) {
          years[year] = {
            name: year,
            revenue: 0,
            bookings: 0,
            contacts: 0,
          };
        }

        years[year].bookings += 1;

        if (b.status === "confirmed") {
          years[year].revenue += Number(b.totalPrice);
        }
      });

      contacts?.forEach((c) => {
        const year = new Date(c.createdAt).getFullYear();

        if (!years[year]) {
          years[year] = {
            name: year,
            revenue: 0,
            bookings: 0,
            contacts: 0,
          };
        }

        years[year].contacts += 1;
      });

      return Object.values(years);
    }

    return [];
  }, [bookings, contacts, range]);

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((acc, curr) => acc + Number(curr.totalPrice), 0);

  return (
    <div className="bg-gray-50 min-h-screen p-6 space-y-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        Travel Agency Dashboard
      </motion.h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Packages" value={packages?.length || 0} />
        <StatCard title="Bookings" value={bookings.length} />
        <StatCard title="Places" value={places?.length || 0} />
        <StatCard title="Reviews" value={reviews?.length || 0} />
        <StatCard title="Contacts" value={contacts?.length || 0} />
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<FaRupeeSign />}
        />
      </div>

      {/* Analytics + Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              Analytics Overview
            </h2>

            <div className="flex gap-3">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="border px-3 py-1 rounded-lg text-sm"
              >
                <option value="revenue">Revenue</option>
                <option value="bookings">Bookings</option>
                <option value="contacts">Contacts</option>
              </select>

              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border px-3 py-1 rounded-lg text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <AnalyticsChart data={analyticsData} metric={metric} />
        </div>

        {/* Booking Status */}
<div className="bg-white p-6 rounded-xl shadow-sm">
          <BookingStatusChart bookings={bookings} />
        </div>
        
      </div>

      {/* Calendar + Upcoming */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarSection bookings={bookings} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingBookings bookings={bookings} />
        </div>
      </div>
    </div>
  );
}