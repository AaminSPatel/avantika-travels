"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/page-header";
import { useSite } from "@/context/site-context";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiMapPin,
  FiClock,
  FiCheck,
  FiLoader,
  FiCalendar,
  FiHome,
  FiCreditCard,
  FiPackage,
  FiUsers,
  FiSearch,
  FiX,
  FiInfo,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

// Bus fare matrix (per person) - prices from each city to other cities
const BUS_FARE_MATRIX = {
  Ujjain: {
    Ujjain: 0,
    Indore: 200,
    Mumbai: 800,
    Delhi: 1000,
    Pune: 600,
    Chennai: 1200,
    Kolkata: 1100,
    Dewas: 150,
  },
  Indore: {
    Ujjain: 200,
    Indore: 0,
    Mumbai: 700,
    Delhi: 900,
    Pune: 500,
    Chennai: 1100,
    Kolkata: 1000,
    Dewas: 100,
  },
  Mumbai: {
    Ujjain: 800,
    Indore: 700,
    Mumbai: 0,
    Delhi: 400,
    Pune: 200,
    Chennai: 900,
    Kolkata: 800,
    Dewas: 750,
  },
  Delhi: {
    Ujjain: 1000,
    Indore: 900,
    Mumbai: 400,
    Delhi: 0,
    Pune: 600,
    Chennai: 800,
    Kolkata: 700,
    Dewas: 950,
  },
  Pune: {
    Ujjain: 600,
    Indore: 500,
    Mumbai: 200,
    Delhi: 600,
    Pune: 0,
    Chennai: 700,
    Kolkata: 600,
    Dewas: 550,
  },
  Chennai: {
    Ujjain: 1200,
    Indore: 1100,
    Mumbai: 900,
    Delhi: 800,
    Pune: 700,
    Chennai: 0,
    Kolkata: 300,
    Dewas: 1150,
  },
  Kolkata: {
    Ujjain: 1100,
    Indore: 1000,
    Mumbai: 800,
    Delhi: 700,
    Pune: 600,
    Chennai: 300,
    Kolkata: 0,
    Dewas: 1050,
  },
  Dewas: {
    Ujjain: 150,
    Indore: 100,
    Mumbai: 750,
    Delhi: 950,
    Pune: 550,
    Chennai: 1150,
    Kolkata: 1050,
    Dewas: 0,
  },
};

// Get available cities from website data using routePricing
const getAvailableCities = (siteData) => {
  const fromCities = siteData?.routePricing?.map((r) => r.from) || [];
  const defaultCities = [
    "Ujjain",
    "Indore",
    "Mumbai",
    "Delhi",
    "Pune",
    "Chennai",
    "Kolkata",
    "Dewas",
  ];
  const allCities = [...new Set([...fromCities, ...defaultCities])];
  return allCities;
};

// Get route price from website data - finds price for from -> to route
const getRoutePrice = (fromCity, toCity, siteData) => {
  if (!siteData?.routePricing || !fromCity || !toCity) return 0;
  const route = siteData.routePricing.find(
    (r) =>
      r.from.toLowerCase() === fromCity.toLowerCase() &&
      r.to.toLowerCase() === toCity.toLowerCase(),
  );
  return route?.price || 0;
};

// Terms and conditions
const TERMS_AND_CONDITIONS = `
1. Booking Confirmation: The booking is confirmed only after payment of the advance amount (40% of total package cost).

2. Cancellation Policy: 
   - 10% deduction if cancelled 7+ days before travel date
   - 25% deduction if cancelled 3-6 days before travel date
   - 50% deduction if cancelled 1-2 days before travel date
   - No refund if cancelled on the travel date

3. Refund Policy: Refunds will be processed within 7-10 business days after cancellation.

4. Travel Documents: Guests must carry valid ID proof (Aadhar Card/PAN Card/Passport) for verification.

5. The management is not responsible for any personal belongings, valuables, or luggage.

6. The management reserves the right to change the itinerary in case of unforeseen circumstances.

7. All disputes are subject to Ujjain jurisdiction only.
`;

export default function BookingForm() {
  const searchParams = useSearchParams();
  const packageIdFromUrl = searchParams.get("packageId");
  const serviceName = searchParams.get("service");
  const { siteData, packages } = useSite();

  const [allPackages, setAllPackages] = useState([]);
  const [packageData, setPackageData] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Step management - 1: Package Selection, 2: Personal Details, 3: Payment, 4: Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profId: "",
    adharNumber: "",
    numberOfPeople: "2",
    travelDate: "",
    specialRequests: "",
    pickupPoints: "",
    dropPoints: "",
    groupPackage: false,
    personalGroupPackage: false,
    roomType: "",
    termsAccepted: false,
  });

  useEffect(() => {
    if (packages && packages.length > 0) {
      setAllPackages(packages);
    }
  }, [packages]);

  useEffect(() => {
    if (packageIdFromUrl) {
      setSelectedPackageId(packageIdFromUrl);
      fetchPackageDetails(packageIdFromUrl);
    }
  }, [packageIdFromUrl]);

  const fetchPackageDetails = async (id) => {
    setPackageLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/packages/${id}`,
      );
      if (response.ok) {
        const data = await response.json();
        setPackageData(data);
      }
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "termsAccepted") {
      setTermsError(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackageId(pkg._id);
    setPackageData(pkg);
    setPackageSearch(pkg.name);
    setShowPackageDropdown(false);
  };

  const handlePackageSearchChange = (e) => {
    const value = e.target.value;
    setPackageSearch(value);
    setShowPackageDropdown(true);
    if (!value) {
      setSelectedPackageId("");
      setPackageData(null);
    }
  };

  const clearPackage = () => {
    setSelectedPackageId("");
    setPackageData(null);
    setPackageSearch("");
    setShowPackageDropdown(false);
  };

  const filteredPackages = allPackages.filter(
    (pkg) =>
      pkg.name?.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.destination?.toLowerCase().includes(packageSearch.toLowerCase()),
  );

  const getBusFare = (fromCity, toCity = "Ujjain") => {
    if (!fromCity || !BUS_FARE_MATRIX[fromCity]) return 0;
    return BUS_FARE_MATRIX[fromCity][toCity] || 0;
  };

  const calculatePrices = () => {
    if (!packageData)
      return { total: 0, advance: 0, balance: 0, pickupFare: 0 };

    const numPeople = parseInt(formData.numberOfPeople);
    let total = packageData.price * numPeople;

    const packageBaseLocation = packageData.destination || "Ujjain";

    let pickupFare = 0;
    if (formData.pickupPoints) {
      pickupFare = getRoutePrice(
        formData.pickupPoints,
        packageBaseLocation,
        siteData,
      );
      if (pickupFare === 0) {
        pickupFare =
          getBusFare(formData.pickupPoints, packageBaseLocation) * numPeople;
      }
    }

    total += pickupFare;

    if (formData.groupPackage && formData.roomType === "double") {
      total += 1000 * numPeople;
    }

    if (formData.personalGroupPackage) {
      total += 250 * numPeople;
    }

    const advance = Math.round(total * 0.4);
    const balance = total - advance;

    return { total, advance, balance, pickupFare };
  };

  const prices = calculatePrices();
  const hasBookingDetails = packageData || serviceName || selectedPackageId;

  // Step validation functions
  const validateStep1 = () => {
    if (!packageData && !serviceName) {
      alert("Please select a package to continue");
      return false;
    }
    if (!formData.pickupPoints) {
      alert("Please select pickup point");
      return false;
    }
    if (!formData.travelDate) {
      alert("Please select travel date");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name) {
      alert("Please enter your full name");
      return false;
    }
    if (!formData.email) {
      alert("Please enter your email");
      return false;
    }
    if (!formData.phone) {
      alert("Please enter your phone number");
      return false;
    }
    if (!formData.adharNumber || formData.adharNumber.length !== 12) {
      alert("Please enter valid 12-digit Aadhar number");
      return false;
    }
    if (!formData.termsAccepted) {
      setTermsError(true);
      alert("Please accept terms and conditions");
      return false;
    }
    return true;
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Handle form submission for step 2
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitStatus(null);

    try {
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        specialRequests: formData.specialRequests || undefined,
        pickupPoints: formData.pickupPoints || undefined,
        dropPoints: formData.pickupPoints || undefined,
        groupPackage: formData.groupPackage || false,
        personalGroupPackage: formData.personalGroupPackage || false,
        adharNumber: formData.adharNumber || undefined,
        roomType: formData.roomType || undefined,
      };

      if (selectedPackageId && packageData) {
        bookingData.packageId = selectedPackageId;
        bookingData.numberOfPeople = parseInt(formData.numberOfPeople);
        bookingData.travelDate = formData.travelDate;
        bookingData.totalPrice = prices.total;
        bookingData.advancePayment = prices.advance;
        bookingData.balancePayment = prices.balance;
        bookingData.paymentStatus = "pending";
      } else if (serviceName) {
        bookingData.serviceName = serviceName;
        bookingData.numberOfPeople = parseInt(formData.numberOfPeople);
        bookingData.travelDate = formData.travelDate;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        },
      );

      if (response.ok) {
        const result = await response.json();
        setBookingId(result._id);
        setSubmitStatus("success");

        // Move to payment step if package booking
        if (selectedPackageId && packageData) {
          setCurrentStep(3);
        } else {
          // For service booking, go directly to confirmation
          setCurrentStep(4);
        }
      } else {
        setSubmitStatus("error");
        alert("Booking submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus("error");
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      const merchantKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || "gtKFFx";
      const txnId =
        "TXN" + Date.now() + Math.random().toString(36).substr(2, 9);

      const paymentData = {
        key: merchantKey,
        txnid: txnId,
        amount: prices.advance.toString(),
        productinfo: packageData?.name || "Package Booking",
        firstname: formData.name,
        email: formData.email,
        phone: formData.phone,
        surl: `${window.location.origin}/booking?payment=success&bookingId=${bookingId}`,
        furl: `${window.location.origin}/booking?payment=failed&bookingId=${bookingId}`,
      };

      const payuForm = document.createElement("form");
      payuForm.method = "POST";
      payuForm.action = "https://test.payu.in/_payment";

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        payuForm.appendChild(input);
      });

      const hashInput = document.createElement("input");
      hashInput.type = "hidden";
      hashInput.name = "hash";
      hashInput.value = "demo_hash";
      payuForm.appendChild(hashInput);

      document.body.appendChild(payuForm);
      payuForm.submit();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentProcessing(true);
    try {
      const token = localStorage.getItem("adminToken");
      const paymentId = "PAY" + Date.now();
      const paymentDate = new Date().toISOString();

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            paymentStatus: "paid",
            paymentId: paymentId,
            paymentDate: paymentDate,
          }),
        },
      );

      if (updateResponse.ok) {
        const bookingData = await updateResponse.json();

        try {
          const whatsappData = {
            phoneNumber: formData.phone,
            bookingData: {
              name: formData.name,
              bookingId: bookingData._id,
              packageName: packageData?.name || bookingData.packageName,
              serviceName: serviceName || bookingData.serviceName,
              numberOfPeople: formData.numberOfPeople,
              travelDate: formData.travelDate,
              totalPrice: prices.total,
              balancePayment: prices.balance,
            },
            paymentData: {
              amountPaid: prices.advance,
              paymentId: paymentId,
              paymentDate: paymentDate,
            },
            type: "payment_success",
          };

          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/whatsapp/send`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(whatsappData),
            },
          );
        } catch (whatsappError) {
          console.error("WhatsApp notification error:", whatsappError);
        }

        // Move to confirmation step
        setCurrentStep(4);
      } else {
        alert("Payment update failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment update error:", error);
      alert("Payment update failed. Please contact support.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleDemoPayment = () => {
    handlePaymentSuccess();
  };

  /* const sendWhatsAppMessage = async () => {
    let message = `*New Booking Request*\n\n`
    if (packageData) {
      message += `*Package:* ${packageData.name}\n`
      message += `*Price:* ₹${packageData.price} per person\n`
      message += `*Duration:* ${packageData.duration}\n\n`
    } else if (serviceName) {
      message += `*Service:* ${serviceName}\n\n`
    }
    message += `*Name:* ${formData.name}\n`
    message += `*Email:* ${formData.email}\n`
    message += `*Phone:* ${formData.phone}\n`
    if (formData.age) message += `*Age:* ${formData.age}\n`
    if (formData.gender) message += `*Gender:* ${formData.gender}\n`
    if (formData.pickupPoints) message += `*Pickup:* ${formData.pickupPoints}\n`
    if (formData.dropPoints) message += `*Drop:* ${formData.dropPoints}\n`
    if (formData.roomType) message += `*Room Type:* ${formData.roomType}\n`
    if (formData.adharNumber) message += `*Aadhar:* ${formData.adharNumber}\n`
    if (packageData || serviceName) {
      message += `*Number of People:* ${formData.numberOfPeople}\n`
      message += `*Travel Date:* ${formData.travelDate}\n`
      if (packageData) {
        message += `*Total Price:* ₹${prices.total}\n`
        message += `*Advance (40%):* ₹${prices.advance}\n`
        message += `*Balance:* ₹${prices.balance}\n`
      }
    }
    if (formData.specialRequests) message += `\n*Special Requests:* ${formData.specialRequests}\n`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${siteData?.contactInfo?.phone?.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  } */

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const bookingIdParam = searchParams.get("bookingId");
    if (paymentStatus === "success" && bookingIdParam) {
      handlePaymentSuccess();
    }
  }, [searchParams]);

  // Step indicators
  const steps = [
    { number: 1, title: "Select Package", icon: FiPackage },
    { number: 2, title: "Personal Details", icon: FiUser },
    { number: 3, title: "Payment", icon: FiCreditCard },
    { number: 4, title: "Confirmation", icon: FiCheckCircle },
  ];

  return (
    <>
      <PageHeader
        title={
          packageData
            ? `Book ${packageData.name}`
            : serviceName
              ? `Book ${serviceName}`
              : "Book Your Dream Tour"
        }
        subtitle={
          packageData
            ? `${packageData.duration} • ${packageData.destination}`
            : "Fill in your details and we'll get back to you shortly"
        }
        backgroundImage="/pik8.avif"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto sm:px-4">
          <div className="max-w-3xl mx-auto">
            {/* Step Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex-1 relative">
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-1 ${
                          currentStep > step.number
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step.number
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-500"
                        } ${currentStep === step.number ? "ring-4 ring-primary/20" : ""}`}
                      >
                        {currentStep > step.number ? (
                          <FiCheck className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          currentStep >= step.number
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              {/* Step 1: Package Selection */}
              {currentStep === 1 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <FiPackage className="text-primary" />
                      Step 1: Select Your Package
                    </h2>

                    {packageLoading && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                        <FiLoader className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">
                          Loading package details...
                        </span>
                      </div>
                    )}

                    {packageData && (
                      <div className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                        <div className="flex gap-4 items-center">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                packageData.images?.[0]?.url ||
                                "/placeholder.svg"
                              }
                              alt={packageData.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-lg">
                              {packageData.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <FiClock className="w-4 h-4" />
                              <span>{packageData.duration}</span>
                              <span className="mx-1">•</span>
                              <FiMapPin className="w-4 h-4" />
                              <span>{packageData.destination}</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-primary font-bold">
                                ₹{packageData.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                per person
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={clearPackage}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mb-4 relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Search & Select Package *
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="packageSearch"
                          value={packageSearch}
                          onChange={handlePackageSearchChange}
                          onFocus={() => setShowPackageDropdown(true)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Search packages by name or destination..."
                        />
                      </div>

                      {showPackageDropdown && filteredPackages.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredPackages.map((pkg) => (
                            <button
                              key={pkg._id}
                              type="button"
                              onClick={() => handlePackageSelect(pkg)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={
                                    pkg.images?.[0]?.url || "/placeholder.svg"
                                  }
                                  alt={pkg.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {pkg.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {pkg.duration} • ₹{pkg.price} •{" "}
                                  {pkg.destination}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Onboard Point *
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="pickupPoints"
                          value={formData.pickupPoints}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select pickup point</option>
                          {getAvailableCities(siteData).map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Number of People
                      </label>
                      <div className="relative">
                        <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="numberOfPeople"
                          value={formData.numberOfPeople}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Person" : "People"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <FiPackage className="w-5 h-5" />
                        Package Type
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="groupPackage"
                            checked={formData.groupPackage}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="text-sm">Group Package</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="personalGroupPackage"
                            checked={formData.personalGroupPackage}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="text-sm">
                            Personal Group Package
                          </span>
                        </label>
                      </div>
                    </div>
                    {/* Travel Date - Conditional based on package type */}
                    {/* Travel Date - Conditional based on package type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Travel Date *
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                        {formData.groupPackage ? (
                          // Group Package - Show upcoming dates dropdown
                          <select
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">
                              Select an upcoming group date
                            </option>
                            {packageData?.upcomingDates?.length > 0 ? (
                              packageData.upcomingDates.map((date, index) => {
                                const dateObj = new Date(date);
                                return (
                                  <option key={index} value={date}>
                                    {dateObj.toLocaleDateString("en-IN", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </option>
                                );
                              })
                            ) : (
                              <option value="" disabled>
                                No upcoming dates available for this package
                              </option>
                            )}
                          </select>
                        ) : formData.personalGroupPackage ? (
                          // Personal Group Package - Show date input with 2 months limit
                          <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            max={
                              new Date(
                                new Date().setMonth(new Date().getMonth() + 2),
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          // Regular Booking - Show normal date input
                          <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        )}
                      </div>

                      {/* Helper text for personal group package */}
                      {formData.personalGroupPackage && (
                        <p className="text-xs text-gray-500 mt-1">
                          You can select any date up to 2 months in advance for
                          your personal group
                        </p>
                      )}

                      {/* Helper text for group package when no dates available */}
                      {formData.groupPackage &&
                        !packageData?.upcomingDates?.length && (
                          <p className="text-xs text-amber-600 mt-1">
                            No upcoming dates found. Please contact support or
                            select personal group package.
                          </p>
                        )}
                    </div>
                    {/* Room Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Room Type
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <label
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.roomType === "double" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <input
                            type="radio"
                            name="roomType"
                            value="double"
                            checked={formData.roomType === "double"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="font-medium">Double Sharing</span>
                          {formData.groupPackage ? (
                            <span className="text-xs text-green-600 mt-1">
                              +₹1000/person
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 mt-1">
                              Not available
                            </span>
                          )}
                        </label>
                        <label
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.roomType === "triple" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <input
                            type="radio"
                            name="roomType"
                            value="triple"
                            checked={formData.roomType === "triple"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="font-medium">Triple Sharing</span>
                          <span className="text-xs text-gray-500 mt-1">
                            Included
                          </span>
                        </label>
                        <label
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.roomType === "quad" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <input
                            type="radio"
                            name="roomType"
                            value="quad"
                            checked={formData.roomType === "quad"}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="font-medium">Quad Sharing</span>
                          <span className="text-xs text-gray-500 mt-1">
                            Included
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Price Summary */}
                    {packageData && (
                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <h4 className="font-semibold text-foreground mb-2">
                          Price Summary
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-medium">
                            Total Price:
                          </span>
                          <span className="text-primary font-bold text-2xl">
                            ₹{prices.total.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.numberOfPeople} person(s) × ₹
                          {packageData.price.toLocaleString()}
                        </p>
                        {prices.pickupFare > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Pickup Fare: +₹{prices.pickupFare.toLocaleString()}
                          </p>
                        )}
                        {formData.groupPackage &&
                          formData.roomType === "double" && (
                            <p className="text-sm text-green-600">
                              Double Sharing: +₹
                              {parseInt(formData.numberOfPeople) * 1000}
                            </p>
                          )}
                        {formData.personalGroupPackage && (
                          <p className="text-sm text-green-600">
                            Personal Group Package: +₹
                            {parseInt(formData.numberOfPeople) * 250}
                          </p>
                        )}
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <div className="flex justify-between text-sm">
                            <span>Advance (40%):</span>
                            <span className="font-semibold text-green-600">
                              ₹{prices.advance.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Balance:</span>
                            <span className="font-semibold">
                              ₹{prices.balance.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <FiUser className="text-primary" />
                      Step 2: Personal Details
                    </h2>

                    {/* Selected Package Summary */}
                    {packageData && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={
                                packageData.images?.[0]?.url ||
                                "/placeholder.svg"
                              }
                              alt={packageData.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {packageData.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formData.numberOfPeople} People •{" "}
                              {formData.travelDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Aadhar Number *
                        </label>
                        <input
                          type="text"
                          name="adharNumber"
                          value={formData.adharNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={12}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter Aadhar number (12 digits)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="1"
                          max="120"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Special Requests
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Any special requirements, dietary needs..."
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <label className="text-sm text-foreground">
                            I accept the{" "}
                            <button
                              type="button"
                              onClick={() => setShowTerms(true)}
                              className="text-primary underline hover:text-primary/80"
                            >
                              Terms and Conditions
                            </button>{" "}
                            and booking policies *
                          </label>
                          {termsError && (
                            <p className="text-red-500 text-sm mt-1">
                              Please accept the terms and conditions to proceed
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <FiCreditCard className="text-primary" />
                      Step 3: Make Payment
                    </h2>

                    {packageData && (
                      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
                          <FiCreditCard className="w-5 h-5" />
                          Payment Details
                        </h3>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center pb-2 border-b border-green-200">
                            <span className="text-gray-600">Package:</span>
                            <span className="font-medium">
                              {packageData.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Number of People:
                            </span>
                            <span className="font-medium">
                              {formData.numberOfPeople}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Date:</span>
                            <span className="font-medium">
                              {new Date(formData.travelDate).toLocaleDateString(
                                "en-IN",
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Price:</span>
                            <span className="font-semibold">
                              ₹{prices.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Advance Payment (40%):
                            </span>
                            <span className="font-bold text-green-600 text-xl">
                              ₹{prices.advance.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Balance to Pay Later:
                            </span>
                            <span className="font-semibold">
                              ₹{prices.balance.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 bg-white p-3 rounded-lg">
                          Pay ₹{prices.advance.toLocaleString()} now to confirm
                          your booking. Remaining amount can be paid later.
                        </p>

                        <button
                          type="button"
                          onClick={handlePayment}
                          disabled={paymentProcessing}
                          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
                        >
                          {paymentProcessing ? (
                            <>
                              <FiLoader className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiCreditCard className="w-5 h-5" />
                              Pay ₹{prices.advance.toLocaleString()} via PayU
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDemoPayment}
                          disabled={paymentProcessing}
                          className="w-full mt-3 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          Demo: Simulate Successful Payment
                        </button>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                          You will receive a confirmation on WhatsApp after
                          successful payment
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Booking Confirmed! 🎉
                    </h2>

                    <p className="text-gray-600 text-lg mb-4">
                      Thank you for booking with {siteData?.siteName || "us"}
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-6">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <FiInfo className="w-5 h-5" />
                        Booking Details
                      </h3>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Booking ID:</span>{" "}
                          {bookingId}
                        </p>
                        {packageData && (
                          <>
                            <p>
                              <span className="font-medium">Package:</span>{" "}
                              {packageData.name}
                            </p>
                            <p>
                              <span className="font-medium">Duration:</span>{" "}
                              {packageData.duration}
                            </p>
                          </>
                        )}
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {formData.name}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {formData.phone}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {formData.email}
                        </p>
                        <p>
                          <span className="font-medium">Travel Date:</span>{" "}
                          {new Date(formData.travelDate).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Number of People:</span>{" "}
                          {formData.numberOfPeople}
                        </p>
                        {packageData && (
                          <>
                            <p>
                              <span className="font-medium">Total Amount:</span>{" "}
                              ₹{prices.total.toLocaleString()}
                            </p>
                            <p>
                              <span className="font-medium">Amount Paid:</span>{" "}
                              ₹{prices.advance.toLocaleString()}
                            </p>
                            <p>
                              <span className="font-medium">
                                Balance Amount:
                              </span>{" "}
                              ₹{prices.balance.toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <FiMessageSquare className="w-6 h-6 text-green-600" />
                        <p className="font-semibold text-green-800 text-lg">
                          📱 WhatsApp Confirmation Sent!
                        </p>
                      </div>
                      <p className="text-green-700">
                        We have sent a confirmation message to your WhatsApp
                        number{" "}
                        <span className="font-bold">{formData.phone}</span>
                      </p>
                      <p className="text-green-600 text-sm mt-2">
                        You will receive all future updates and journey details
                        on WhatsApp
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Go to Homepage
                      </Link>
                      {/*  <button
                        onClick={sendWhatsAppMessage}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiMessageSquare className="w-5 h-5" />
                        Send Details on WhatsApp
                      </button> */}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Navigation Buttons (for steps 1-3) */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FiArrowLeft className="w-5 h-5" />
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {currentStep === 1
                          ? "Continue to Personal Details"
                          : currentStep === 2
                            ? "Submit & Proceed to Payment"
                            : "Proceed to Payment"}
                        <FiArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Terms and Conditions
                </h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {TERMS_AND_CONDITIONS}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  I have read and understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
