"use client";

import { useEffect, useState } from "react";
import {
  X,
  Eye,
  Trash2,
  Check,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Plus,
  Filter,
  MessageCircle,
  CheckCircle,
  Clock,
  Rocket,
  Award,
  Star,
  Gift,
  Sparkles,
} from "lucide-react";


export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showDetails, setShowDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showFilters, setShowFilters] = useState(true);



  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    numberOfPeople: 1,
    travelDate: "",
    specialRequests: "",
    packageName: "",
    packagePrice: "",
    packageDuration: "",
    serviceName: "",
    totalPrice: 0,
    status: "pending",
    pickupPoints: "",
    dropPoints: "",
    groupPackage: false,
    personalGroupPackage: false,
    profId: "",
    adharNumber: "",
    roomType: "",
    otherRequirements: "",
    advancePayment: 0,
    balancePayment: 0,
    paymentStatus: "pending",
    paymentId: "",
    paymentDate: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showAlert("error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        fetchBookings();
        showAlert("success", "Status updated successfully");
      } else {
        showAlert("error", "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("error", "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          fetchBookings();
          showAlert("success", "Booking deleted successfully");
        } else {
          showAlert("error", "Failed to delete booking");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        showAlert("error", "Failed to delete booking");
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      name: booking.name || "",
      email: booking.email || "",
      phone: booking.phone || "",
      age: booking.age || "",
      gender: booking.gender || "",
      numberOfPeople: booking.numberOfPeople || 1,
      travelDate: booking.travelDate
        ? new Date(booking.travelDate).toISOString().split("T")[0]
        : "",
      specialRequests: booking.specialRequests || "",
      packageName: booking.packageName || "",
      packagePrice: booking.packagePrice || "",
      packageDuration: booking.packageDuration || "",
      serviceName: booking.serviceName || "",
      totalPrice: booking.totalPrice || 0,
      status: booking.status || "pending",
      pickupPoints: booking.pickupPoints || "",
      dropPoints: booking.dropPoints || "",
      groupPackage: booking.groupPackage || false,
      personalGroupPackage: booking.personalGroupPackage || false,
      profId: booking.profId || "",
      adharNumber: booking.adharNumber || "",
      roomType: booking.roomType || "",
      otherRequirements: booking.otherRequirements || "",
      advancePayment: booking.advancePayment || 0,
      balancePayment: booking.balancePayment || 0,
      paymentStatus: booking.paymentStatus || "pending",
      paymentId: booking.paymentId || "",
      paymentDate: booking.paymentDate
        ? new Date(booking.paymentDate).toISOString().split("T")[0]
        : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/${editingBooking._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        fetchBookings();
        showAlert("success", "Booking updated successfully");
        setShowForm(false);
        setEditingBooking(null);
      } else {
        showAlert("error", "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      showAlert("error", "Failed to update booking");
    }
  };



  // Filtering and sorting logic
  const filteredBookings = bookings
    .filter((booking) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchName = booking.name?.toLowerCase().includes(search);
        const matchEmail = booking.email?.toLowerCase().includes(search);
        const matchPhone = booking.phone?.includes(search);
        const matchPackage = booking.packageName
          ?.toLowerCase()
          .includes(search);
        const matchService = booking.serviceName
          ?.toLowerCase()
          .includes(search);
        if (
          !matchName &&
          !matchEmail &&
          !matchPhone &&
          !matchPackage &&
          !matchService
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const bookingDate = new Date(booking.createdAt);
        const now = new Date();
        const daysDiff = Math.floor(
          (now - bookingDate) / (1000 * 60 * 60 * 24),
        );

        switch (dateFilter) {
          case "today":
            if (daysDiff > 0) return false;
            break;
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
        }
      }

      // Price range filter
      if (priceRangeFilter !== "all") {
        const price = booking.totalPrice || 0;
        switch (priceRangeFilter) {
          case "0-10000":
            if (price > 10000) return false;
            break;
          case "10000-50000":
            if (price < 10000 || price > 50000) return false;
            break;
          case "50000-100000":
            if (price < 50000 || price > 100000) return false;
            break;
          case "100000+":
            if (price < 100000) return false;
            break;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "price-low":
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        case "price-high":
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Alert Component */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            alert.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          <div className="flex items-center">
            {alert.type === "success" ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              Bookings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer bookings and reservations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
              className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          {/* Filter Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-black font-medium"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold">{filteredBookings.length}</span>{" "}
              bookings
            </div>
          </div>

          {/* Filter Content */}
          {showFilters && (
            <div className="space-y-4">
              {/* Search */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search by name, email, phone, package..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Filter Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <select
                  value={priceRangeFilter}
                  onChange={(e) => setPriceRangeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="0-10000">₹0 - ₹10,000</option>
                  <option value="10000-50000">₹10,000 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000+">₹1,00,000+</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header with Status */}
                <div className="relative p-5 pb-3">
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    {booking.status?.charAt(0).toUpperCase() +
                      booking.status?.slice(1)}
                  </div>
                  <h3 className="text-lg font-bold text-black truncate pr-20">
                    {booking.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>

                {/* Package/Service Info */}
                <div className="px-5 pb-3">
                  {booking.packageName && (
                    <div className="bg-pink-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-pink-800 truncate">
                        {booking.packageName}
                      </p>
                      <p className="text-xs text-pink-600">
                        ₹{booking.packagePrice} • {booking.packageDuration}
                      </p>
                    </div>
                  )}
                  {booking.serviceName && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-800 truncate">
                        {booking.serviceName}
                      </p>
                      <p className="text-xs text-blue-600">Service Booking</p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="px-5 pb-3 space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{booking.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{booking.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{booking.numberOfPeople} People</span>
                  </div>
                  {booking.travelDate && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatDate(booking.travelDate)}</span>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                {booking.totalPrice > 0 && (
                  <div className="px-5 pb-3 border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Price:
                      </span>
                      <span className="text-lg font-bold text-pink-600">
                        ₹{booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowDetails(booking)}
                      className="flex-1 min-w-[70px] px-2 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(booking)}
                      className="flex-1 min-w-[70px] px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-xs"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </button>
                    {booking.status === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking._id, "confirmed")
                        }
                        className="flex-1 min-w-[70px] px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Confirm
                      </button>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking._id, "completed")
                        }
                        className="flex-1 min-w-[70px] px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Complete
                      </button>
                    )}
                    {booking.status !== "cancelled" &&
                      booking.status !== "completed" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(booking._id, "cancelled")
                          }
                          className="flex-1 min-w-[70px] px-2 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center text-xs"
                        >
                          Cancel
                        </button>
                      )}

                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="flex-1 min-w-[70px] px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package/Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Travel Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">
                              {booking.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.packageName && (
                          <div className="text-sm font-medium text-black">
                            {booking.packageName}
                          </div>
                        )}
                        {booking.serviceName && (
                          <div className="text-sm font-medium text-blue-800">
                            {booking.serviceName}
                          </div>
                        )}
                        {!booking.packageName && !booking.serviceName && (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-black">
                          {booking.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {booking.travelDate
                          ? formatDate(booking.travelDate)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {booking.numberOfPeople || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-600">
                        {booking.totalPrice > 0
                          ? `₹${booking.totalPrice.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status?.charAt(0).toUpperCase() +
                            booking.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDetails(booking)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          {booking.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "confirmed")
                              }
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Confirm"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "completed")
                              }
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Mark Complete"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {booking.status !== "cancelled" &&
                            booking.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(booking._id, "cancelled")
                                }
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Cancel"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}

                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              statusFilter !== "all" ||
              dateFilter !== "all" ||
              priceRangeFilter !== "all"
                ? "Try adjusting your filters"
                : "Bookings will appear here when customers make reservations"}
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {/* Status & Date */}
                <div className="flex justify-between items-center mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(showDetails.status)}`}
                  >
                    {showDetails.status?.charAt(0).toUpperCase() +
                      showDetails.status?.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Booked on: {formatDate(showDetails.createdAt)}
                  </span>
                </div>

                {/* Package/Service Info */}
                {showDetails.packageName && (
                  <div className="bg-pink-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-pink-800 mb-2">
                      Package Details
                    </h3>
                    <p className="font-medium text-black">
                      {showDetails.packageName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2 font-medium">
                          ₹{showDetails.packagePrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2">
                          {showDetails.packageDuration}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {showDetails.serviceName && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-blue-800 mb-2">
                      Service Details
                    </h3>
                    <p className="font-medium text-black">
                      {showDetails.serviceName}
                    </p>
                  </div>
                )}

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-bold text-black mb-3">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium text-black">
                          {showDetails.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-black">
                          {showDetails.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-black">
                          {showDetails.phone}
                        </p>
                      </div>
                    </div>
                    {showDetails.age && (
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium text-black">
                          {showDetails.age} years
                        </p>
                      </div>
                    )}
                    {showDetails.gender && (
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-medium text-black capitalize">
                          {showDetails.gender}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="mb-6">
                  <h3 className="font-bold text-black mb-3">Booking Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Number of People</p>
                      <p className="font-medium text-black">
                        {showDetails.numberOfPeople || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Travel Date</p>
                      <p className="font-medium text-black">
                        {showDetails.travelDate
                          ? formatDate(showDetails.travelDate)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Price</p>
                      <p className="font-bold text-pink-600 text-lg">
                        {showDetails.totalPrice > 0
                          ? `₹${showDetails.totalPrice.toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {showDetails.specialRequests && (
                  <div className="mb-6">
                    <h3 className="font-bold text-black mb-2">
                      Special Requests
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {showDetails.specialRequests}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {showDetails.status === "pending" && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(showDetails._id, "confirmed");
                        setShowDetails(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Confirm Booking
                    </button>
                  )}
                  {showDetails.status === "confirmed" && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(showDetails._id, "completed");
                        setShowDetails(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Mark Completed
                    </button>
                  )}
                  {showDetails.status !== "cancelled" &&
                    showDetails.status !== "completed" && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(showDetails._id, "cancelled");
                          setShowDetails(null);
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  <button
                    onClick={() => {
                      handleEdit(showDetails);
                      setShowDetails(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    Edit Booking
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(showDetails._id);
                      setShowDetails(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 inline mr-2" />
                    Delete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Edit Booking</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="font-bold text-black mb-4">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Package/Service Information */}
                  <div>
                    <h3 className="font-bold text-black mb-4">
                      Package/Service Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Name
                        </label>
                        <input
                          type="text"
                          value={formData.packageName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packageName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Price
                        </label>
                        <input
                          type="number"
                          value={formData.packagePrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packagePrice: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Duration
                        </label>
                        <input
                          type="text"
                          value={formData.packageDuration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packageDuration: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={formData.serviceName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h3 className="font-bold text-black mb-4">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of People
                        </label>
                        <input
                          type="number"
                          value={formData.numberOfPeople}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numberOfPeople: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel Date
                        </label>
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              travelDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Price
                        </label>
                        <input
                          type="number"
                          value={formData.totalPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalPrice: parseFloat(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Update Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
