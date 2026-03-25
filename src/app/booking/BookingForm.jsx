"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
//import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/page-header";
import { useSite } from "@/context/site-context";
import { sendFollowupMessage } from "@/utils/whatsapp";

import {
  FiUser,
  FiMapPin,
  FiCheck,
  FiLoader,
  FiDownload,
  FiPackage,
  FiSearch,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

// Bus fare matrix
const BUS_FARE_MATRIX = {
  Ujjain: { Ujjain: 0, Indore: 200, Mumbai: 800, Delhi: 1000, Pune: 600, Chennai: 1200, Kolkata: 1100, Dewas: 150 },
  Indore: { Ujjain: 200, Indore: 0, Mumbai: 700, Delhi: 900, Pune: 500, Chennai: 1100, Kolkata: 1000, Dewas: 100 },
  Mumbai: { Ujjain: 800, Indore: 700, Mumbai: 0, Delhi: 400, Pune: 200, Chennai: 900, Kolkata: 800, Dewas: 750 },
  Delhi: { Ujjain: 1000, Indore: 900, Mumbai: 400, Delhi: 0, Pune: 600, Chennai: 800, Kolkata: 700, Dewas: 950 },
  Pune: { Ujjain: 600, Indore: 500, Mumbai: 200, Delhi: 600, Pune: 0, Chennai: 700, Kolkata: 600, Dewas: 550 },
  Chennai: { Ujjain: 1200, Indore: 1100, Mumbai: 900, Delhi: 800, Pune: 700, Chennai: 0, Kolkata: 300, Dewas: 1150 },
  Kolkata: { Ujjain: 1100, Indore: 1000, Mumbai: 800, Delhi: 700, Pune: 600, Chennai: 300, Kolkata: 0, Dewas: 1050 },
  Dewas: { Ujjain: 150, Indore: 100, Mumbai: 750, Delhi: 950, Pune: 550, Chennai: 1150, Kolkata: 1050, Dewas: 0 },
};

const getAvailableCities = (siteData, packageOnboardingPoint) => {
  if (!packageOnboardingPoint || !siteData?.routePricing) {
    return ["Ujjain", "Indore", "Dewas"];
  }
  const validFromCities = siteData.routePricing
    .filter(route => route.to.toLowerCase() === packageOnboardingPoint.toLowerCase())
    .map(route => route.from);
  return [...new Set(validFromCities)];
};

const getPackageOnboardingPoint = (pkg) => pkg?.pickupPoint || "Ujjain";

const getRoutePrice = (fromCity, toCity, siteData) => {
  if (!siteData?.routePricing || !fromCity || !toCity) return 0;
  const route = siteData.routePricing.find(
    (r) => r.from.toLowerCase() === fromCity.toLowerCase() && r.to.toLowerCase() === toCity.toLowerCase()
  );
  return route?.price || 0;
};

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

// Responsive Receipt Component with Mobile Support
const ReceiptContent = ({ formData, packageData, prices, bookingId, siteData, currentDateTime }) => {
  const pinkPrimary = "#ec489a";
  const grayLight = "#f9fafb";
  const borderGray = "#e5e7eb";
  const textBlack = "#111827";
  const textGray = "#4b5563";

  const TERMS_AND_CONDITIONS_ARRAY = [
    "1. Booking Confirmation: 40% advance payment mandatory.",
    "2. Cancellation: 10% (7+ days), 25% (3-6 days), 50% (1-2 days) deduction.",
    "3. No refund if cancelled on the travel date.",
    "4. Valid ID proof (Aadhar/PAN/Passport) is mandatory for all guests.",
    "5. Management is not responsible for personal belongings or luggage.",
    "6. All disputes are subject to Ujjain jurisdiction only."
  ];

  const isPersonal = formData.packageType === 'personal';
  const isDoubleSharing = formData.roomType === 'double';
  const numPeople = parseInt(formData.numberOfPeople) || 1;

  return (
    <div 
      id="receipt"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        color: textBlack,
        lineHeight: '1.4'
      }}
      className="sm:p-8 md:p-10"
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: `1px solid ${borderGray}`, paddingBottom: '15px' }}>
        <img 
          src="/logo1.png" 
          alt="Logo" 
          style={{ height: '50px', width: 'auto', marginBottom: '10px', display: 'block', margin: '0 auto' }}
          className="sm:h-[60px]" 
        />
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }} className="sm:text-2xl md:text-[28px]">BOOKING RECEIPT</h1>
        <p style={{ fontSize: '11px', color: textGray, margin: 0 }} className="sm:text-xs md:text-[13px]">ID: <strong>{bookingId}</strong> | Date: {currentDateTime}</p>
      </div>

      {/* Info Grid - Responsive */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }} className="sm:flex-row sm:gap-[30px]">
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '12px', borderBottom: `2px solid ${pinkPrimary}`, paddingBottom: '5px', marginBottom: '10px' }} className="sm:text-sm">CUSTOMER INFO</h4>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }} className="sm:text-xs md:text-[13px]">
            <p style={{ margin: '0 0 5px 0' }}><strong>Name:</strong> {formData.name}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Phone:</strong> {formData.phone}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Aadhar:</strong> {formData.adharNumber}</p>
            <p style={{ margin: 0 }}><strong>Details:</strong> {formData.age} yrs | {formData.gender}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '12px', borderBottom: `2px solid ${pinkPrimary}`, paddingBottom: '5px', marginBottom: '10px' }} className="sm:text-sm">TOUR INFO</h4>
          <div style={{ fontSize: '11px', lineHeight: '1.6' }} className="sm:text-xs md:text-[13px]">
            <p style={{ margin: '0 0 5px 0' }}><strong>Package:</strong> {packageData?.name}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Duration:</strong> {packageData?.duration || 'N/A'}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Travel Date:</strong> {formData.travelDate}</p>
            <p style={{ margin: 0 }}><strong>Pickup From:</strong> {formData.pickupPoints}</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown - Responsive */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', borderBottom: `2px solid ${pinkPrimary}`, paddingBottom: '5px', marginBottom: '10px' }} className="sm:text-sm">AMOUNT DESCRIPTION</h4>
        <div style={{ border: `1px solid ${borderGray}`, borderRadius: '8px', overflow: 'hidden', fontSize: '11px' }} className="sm:text-xs md:text-[13px]">
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${borderGray}` }}>
            <span>Base Package Price (₹{packageData?.price} x {numPeople})</span>
            <span>₹{(packageData?.price * numPeople).toLocaleString()}</span>
          </div>

          {prices.pickupFare > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${borderGray}` }}>
              <span>Pickup: {prices.routeDescription || formData.pickupPoints}</span>
              <span>+ ₹{prices.pickupFare.toLocaleString()}</span>
            </div>
          )}

          {isDoubleSharing && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${borderGray}` }}>
              <span>Deluxe Double Sharing (₹500 x {numPeople})</span>
              <span>+ ₹{(500 * numPeople).toLocaleString()}</span>
            </div>
          )}

          {isPersonal && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${borderGray}` }}>
              <span>Personal Group Service (₹250 x {numPeople})</span>
              <span>+ ₹{(250 * numPeople).toLocaleString()}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: grayLight, fontWeight: 'bold' }}>
            <span>TOTAL AMOUNT</span>
            <span>₹{prices.total.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', color: pinkPrimary }}>
            <span>Advance Amount to Pay for Confirmation (40%)</span>
            <span>- ₹{prices.advance.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#fff', borderTop: `2px solid ${textBlack}` }}>
            <span style={{ fontWeight: 'bold' }}>BALANCE TO PAY 1 DAY BEFOR TRIP</span>
            <span style={{ color: pinkPrimary, fontWeight: 'bold' }}>₹{prices.balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Terms - Responsive */}
      <div style={{ padding: '12px', backgroundColor: grayLight, borderRadius: '8px', border: `1px solid ${borderGray}` }}>
        <h5 style={{ fontSize: '10px', margin: '0 0 5px 0', textDecoration: 'underline' }} className="sm:text-[11px]">TERMS & CONDITIONS</h5>
        <div style={{ fontSize: '9px', color: textGray, lineHeight: '1.5' }} className="sm:text-[10px]">
          {TERMS_AND_CONDITIONS_ARRAY.map((term, i) => (
            <p key={i} style={{ margin: '0 0 2px 0' }}>{term}</p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '9px', color: '#999' }}>
  <p style={{ margin: 0, fontWeight: 'bold', color: textBlack }}>{siteData?.name}</p>
  <p style={{ margin: '3px 0', textTransform: 'capitalize' }}>
    {siteData?.contactInfo?.address} | {siteData?.contactInfo?.phone}
  </p>
  <p style={{ marginTop: '8px', fontStyle: 'italic' }}>Thank you for choosing us for your spiritual travel!</p>
</div>
    </div>
  );
};

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
  const [bookingId, setBookingId] = useState(null);
  const receiptRef = useRef(null);
  const [showTerms, setShowTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const currentDateTime = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", age: "", gender: "", adharNumber: "",
    numberOfPeople: "2", travelDate: "", specialRequests: "", pickupPoints: "",
    packageType: 'none', groupPackage: false, personalGroupPackage: false, roomType: "", termsAccepted: false,
  });

  // Load html2canvas with proper error handling
  useEffect(() => {
    const loadHtml2Canvas = () => {
      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.html2canvas) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    loadHtml2Canvas().catch(console.error);
  }, []);

  // FIXED: Smooth screenshot download without visual distortion
    const downloadImage = useCallback(async () => {
    if (!receiptRef.current) return;
    setGenerating(true);
    
    try {
      const element = receiptRef.current;
      
      // 1. Create a temporary iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '100%';
      iframe.style.bottom = '100%';
      iframe.style.width = '800px'; // Receipt width
      iframe.style.height = '1200px';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow.document;
      
      // 2. Sirf basic styles aur Receipt content dalo (No Global CSS)
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <style>
              body { margin: 0; padding: 20px; background: white; font-family: Arial, sans-serif; }
              * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
            </style>
          </head>
          <body>
            <div id="capture-area">${element.innerHTML}</div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // 3. Wait for assets to load inside iframe
      await new Promise(resolve => setTimeout(resolve, 800));

      const captureArea = iframeDoc.getElementById('capture-area');

      // 4. Capture from Iframe (Isolated from "lab" errors in main page)
      const canvas = await window.html2canvas(captureArea, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `avantika-receipt-${bookingId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      // 5. Cleanup
      document.body.removeChild(iframe);
      
    } catch (error) {
      console.error('Final Fix Error:', error);
      alert('Screenshot download failed. Please take screenshot.');
    } finally {
      setGenerating(false);
    }
  }, [bookingId]);

  const handleDownload = () => {
    setShowReceiptModal(true);
    // Small delay to ensure modal is rendered
    setTimeout(() => downloadImage(), 200);
  };

  const closeModal = () => {
    setShowReceiptModal(false);
    setGenerating(false);
  };

  const sendWhatsAppMessage = async () => {
    let message = `🆕 NEW BOOKING REQUEST 🎉\n\n`;
    if (packageData) {
      message += `📦 Package: ${packageData.name}\n`;
      message += `💰 Price: ₹${packageData.price} per person\n`;
      message += `⏱️ Duration: ${packageData.duration}\n`;
      message += `📍 Destination: ${packageData.destination}\n\n`;
    } else if (serviceName) {
      message += `🛎️ Service: ${serviceName}\n\n`;
    }
    message += `👤 Customer Details\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📱 Phone: ${formData.phone}\n`;
    if (formData.age) message += `🎂 Age: ${formData.age}\n`;
    if (formData.gender) message += `⚥ Gender: ${formData.gender}\n`;
    if (formData.adharNumber) message += `🆔 Aadhar: ${formData.adharNumber}\n\n`;
    
    message += `✈️ Travel Details\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (formData.pickupPoints) message += `📍 Pickup: ${formData.pickupPoints}\n`;
    if (formData.roomType) message += `🛏️ Room Type: ${formData.roomType}\n`;
    if (packageData || serviceName) {
      message += `👥 Number of People: ${formData.numberOfPeople}\n`;
      message += `📅 Travel Date: ${new Date(formData.travelDate).toLocaleDateString('en-IN')}\n`;
      if (packageData) {
        message += `\n💰 Payment Summary\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `Total Price: ₹${prices.total.toLocaleString()}\n`;
        message += `Advance (40%): ₹${prices.advance.toLocaleString()}\n`;
        message += `Balance: ₹${prices.balance.toLocaleString()}\n`;
        if (prices.routeDescription) message += `📍 Route: ${prices.routeDescription}\n`;
      }
    }
    if (formData.specialRequests) message += `\n💬 Special Requests: ${formData.specialRequests}\n`;
    
    message += `\n✅ Booking ID: ${bookingId}\n`;
    message += `🕐 Booking Time: ${currentDateTime}\n`;
    message += `\n🙏 Thank you for choosing Avantika Travels! `;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${siteData?.contactInfo?.phone?.replace(/\D/g, "") || "919826012345"}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    if (packages) setAllPackages(packages);
  }, [packages]);

  useEffect(() => {
    if (packageIdFromUrl) fetchPackageDetails(packageIdFromUrl);
  }, [packageIdFromUrl]);

  const fetchPackageDetails = async (id) => {
    setPackageLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/packages/${id}`);
      if (res.ok) setPackageData(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "packageType" && value === "personal") {
      const currentPeople = parseInt(formData.numberOfPeople);
      if (currentPeople < 4) {
        alert("Personal Group Package requires minimum 4 persons. Please update number of people.");
        setFormData(prev => ({ ...prev, numberOfPeople: "4" }));
      }
    }
    
    if (name === "numberOfPeople" && formData.packageType === "personal") {
      const newValue = parseInt(value);
      if (newValue < 4) {
        alert("Personal Group Package requires minimum 4 persons.");
        setFormData(prev => ({ ...prev, [name]: "4" }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "termsAccepted") setTermsError(false);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackageId(pkg._id);
    setPackageData(pkg);
    setPackageSearch(pkg.name);
    setShowPackageDropdown(false);
  };

  const clearPackage = () => {
    setSelectedPackageId("");
    setPackageData(null);
    setPackageSearch("");
  };

  const filteredPackages = allPackages.filter(pkg =>
    pkg.name?.toLowerCase().includes(packageSearch.toLowerCase()) ||
    pkg.destination?.toLowerCase().includes(packageSearch.toLowerCase())
  );

  const calculatePrices = () => {
    if (!packageData) return { total: 0, advance: 0, balance: 0, pickupFare: 0, routeDescription: "" };
    const numPeople = parseInt(formData.numberOfPeople);
    let total = packageData.price * numPeople;
    let pickupFare = 0;
    let routeDescription = "";
    const onboardingPoint = getPackageOnboardingPoint(packageData);
    
    if (formData.pickupPoints) {
      const routePricePerPerson = getRoutePrice(formData.pickupPoints, onboardingPoint, siteData);
      pickupFare = routePricePerPerson * numPeople;
      if (routePricePerPerson > 0) {
        routeDescription = `${formData.pickupPoints} → ${onboardingPoint}: ₹${routePricePerPerson}/person`;
      } else {
        const fallbackFarePerPerson = BUS_FARE_MATRIX[formData.pickupPoints]?.[onboardingPoint] || 0;
        pickupFare = fallbackFarePerPerson * numPeople;
        routeDescription = `${formData.pickupPoints} → ${onboardingPoint}: ₹${fallbackFarePerPerson}/person (standard)`;
      }
    }
    total += pickupFare;
    
    if (formData.packageType === 'personal') total += 250 * numPeople;
    if (formData.roomType === "double") total += 500 * numPeople;
    
    const advance = Math.round(total * 0.4);
    return { total, advance, balance: total - advance, pickupFare, routeDescription };
  };

  const prices = calculatePrices();

  const validateStep1 = () => {
    if (!packageData && !serviceName) { alert("Please select a package"); return false; }
    if (!formData.pickupPoints) { alert("Please select pickup point"); return false; }
    if (!formData.travelDate) { alert("Please select travel date"); return false; }
    
    if (formData.packageType === 'personal') {
      const numPeople = parseInt(formData.numberOfPeople);
      if (numPeople < 4) {
        alert("Personal Group Package requires minimum 4 persons. Please update number of people.");
        return false;
      }
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name) { alert("Please enter your full name"); return false; }
    if (!formData.email) { alert("Please enter your email"); return false; }
    if (!formData.phone) { alert("Please enter your phone number"); return false; }
    if (!formData.adharNumber || formData.adharNumber.length !== 12) { alert("Please enter valid 12-digit Aadhar number"); return false; }
    if (!formData.termsAccepted) { setTermsError(true); alert("Please accept terms and conditions"); return false; }
    return true;
  };

  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) handleSubmit();
  };

  const goToPreviousStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        name: formData.name, email: formData.email, phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender, specialRequests: formData.specialRequests,
        pickupPoints: formData.pickupPoints, adharNumber: formData.adharNumber,
        roomType: formData.roomType, groupPackage: formData.groupPackage,
        personalGroupPackage: formData.personalGroupPackage,
      };
      if (selectedPackageId && packageData) {
        bookingData.packageId = selectedPackageId;
        bookingData.numberOfPeople = parseInt(formData.numberOfPeople);
        bookingData.travelDate = formData.travelDate;
        bookingData.totalPrice = prices.total;
        bookingData.advancePayment = prices.advance;
        bookingData.balancePayment = prices.balance;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const result = await res.json();
        setBookingId(result._id);
        
        try {
          await sendFollowupMessage(formData.name, packageData.name, formData.travelDate, packageData.pickupPoint,formData.phone, bookingData);
        } catch (whatsappError) {
          console.error("WhatsApp send error:", whatsappError);
        }
        
        setCurrentStep(3);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Select Package", icon: FiPackage },
    { number: 2, title: "Personal Details", icon: FiUser },
    { number: 3, title: "Receipt", icon: FiCheckCircle },
  ];

  return (
    <>
      <PageHeader
        title={packageData ? `Book ${packageData.name}` : serviceName ? `Book ${serviceName}` : "Book Your Dream Tour"}
        subtitle={packageData ? `${packageData.duration} • ${packageData.destination}` : "Fill in your details"}
        backgroundImage="/pik8.avif"
      />

      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex-1 relative">
                    {index < steps.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-1 ${currentStep > step.number ? "bg-pink-500" : "bg-gray-200"}`} />
                    )}
                    <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${currentStep >= step.number ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                        {currentStep > step.number ? <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${currentStep >= step.number ? "text-pink-500" : "text-gray-400"}`}>{step.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Step 1: Select Your Package</h2>
                  
                  {packageData && (
                    <div className="mb-4 sm:mb-6 bg-pink-50 rounded-xl p-3 sm:p-4 border border-pink-200">
                      <div className="flex gap-3 sm:gap-4 items-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
                          <Image src={packageData.images?.[0]?.url || "/placeholder.svg"} alt={packageData.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg">{packageData.name}</h3>
                          <div className="text-xs sm:text-sm text-gray-600">{packageData.duration} • {packageData.destination}</div>
                          <div className="text-pink-600 font-bold text-sm sm:text-base">₹{packageData.price.toLocaleString()}/person</div>
                        </div>
                        <button onClick={clearPackage} className="text-gray-400 hover:text-red-500"><FiX className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input type="text" value={packageSearch} onChange={(e) => { setPackageSearch(e.target.value); setShowPackageDropdown(true); if (!e.target.value) clearPackage(); }} 
                      onFocus={() => setShowPackageDropdown(true)} className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg text-sm sm:text-base" placeholder="Search packages..." />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    {showPackageDropdown && filteredPackages.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPackages.map(pkg => (
                          <button key={pkg._id} onClick={() => handlePackageSelect(pkg)} className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 flex gap-2 sm:gap-3 border-b">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                              <Image src={pkg.images?.[0]?.url || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                            </div>
                            <div><p className="font-medium text-sm sm:text-base">{pkg.name}</p><p className="text-xs text-gray-500">{pkg.duration} • ₹{pkg.price}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {packageData && (
                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <FiMapPin className="text-blue-600 text-sm sm:text-base" />
                        <span className="font-semibold text-blue-800">
                          Package starts from: <span className="underline">{getPackageOnboardingPoint(packageData)}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Point {packageData ? "*" : ""}</label>
                    <select 
                      name="pickupPoints" 
                      value={formData.pickupPoints} 
                      onChange={handleInputChange} 
                      disabled={!packageData && !serviceName}
                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                    >
                      <option value="">Select pickup point</option>
                      {getAvailableCities(siteData, packageData ? getPackageOnboardingPoint(packageData) : null).map(city => {
                        const pricePerPerson = getRoutePrice(city, getPackageOnboardingPoint(packageData), siteData) || BUS_FARE_MATRIX[city]?.[getPackageOnboardingPoint(packageData)] || 0;
                        return (
                          <option key={city} value={city}>
                            {city} {pricePerPerson > 0 ? ` (₹${pricePerPerson}/person)` : '(Price TBD)'}
                          </option>
                        );
                      })}
                    </select>
                    {!packageData && !serviceName && (
                      <p className="text-xs text-gray-500 mt-1">👆 First select a package to choose pickup</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of People</label>
                    <select name="numberOfPeople" value={formData.numberOfPeople} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} {num === 1 ? "Person" : "People"}</option>)}
                    </select>
                    {formData.packageType === 'personal' && (
                      <p className="text-xs text-pink-600 mt-1">⚠️ Personal Group Package requires minimum 4 persons</p>
                    )}
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-pink-800 mb-2 sm:mb-3 text-sm sm:text-base">Package Type</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border cursor-pointer">
                        <input type="radio" name="packageType" value="group" checked={formData.packageType === 'group'} onChange={handleInputChange} />
                        <div><span className="font-semibold text-sm sm:text-base">Group Package</span><span className="text-xs block text-gray-500">Fixed dates</span></div>
                      </label>
                      <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border cursor-pointer">
                        <input type="radio" name="packageType" value="personal" checked={formData.packageType === 'personal'} onChange={handleInputChange} />
                        <div><span className="font-semibold text-sm sm:text-base">Personal Group</span><span className="text-xs block text-gray-500">+₹250/person • Min 4 persons</span></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Travel Date *</label>
                    <input type="date" name="travelDate" value={formData.travelDate} onChange={handleInputChange} 
                      min={new Date().toISOString().split("T")[0]} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <label className={`p-2 sm:p-3 text-center border rounded-lg cursor-pointer text-xs sm:text-sm ${formData.roomType === "double" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}>
                        <input type="radio" name="roomType" value="double" checked={formData.roomType === "double"} onChange={handleInputChange} className="sr-only" />
                        <span>Double Sharing</span>
                        <span className="text-xs text-pink-600 block">+₹500/person</span>
                      </label>
                      <label className={`p-2 sm:p-3 text-center border rounded-lg cursor-pointer text-xs sm:text-sm ${formData.roomType === "triple" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}>
                        <input type="radio" name="roomType" value="triple" checked={formData.roomType === "triple"} onChange={handleInputChange} className="sr-only" />
                        <span>Triple Sharing</span>
                      </label>
                      <label className={`p-2 sm:p-3 text-center border rounded-lg cursor-pointer text-xs sm:text-sm ${formData.roomType === "quad" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}>
                        <input type="radio" name="roomType" value="quad" checked={formData.roomType === "quad"} onChange={handleInputChange} className="sr-only" />
                        <span>Quad Sharing</span>
                      </label>
                    </div>
                  </div>

                  {packageData && (
                    <div className="bg-pink-50 rounded-lg p-3 sm:p-4">
                      <div className="flex justify-between text-sm sm:text-base"><span>Package Price:</span><span>₹{(packageData.price * parseInt(formData.numberOfPeople)).toLocaleString()}</span></div>
                      {prices.routeDescription && (
                        <div className="flex flex-col mt-1 text-xs sm:text-sm">
                          <span className="font-medium text-gray-800">{prices.routeDescription}</span>
                          <span className="text-xs text-gray-500">({prices.pickupFare.toLocaleString()} total for {formData.numberOfPeople} people)</span>
                        </div>
                      )}
                      {!prices.routeDescription && formData.pickupPoints && packageData && (
                        <div className="text-xs text-yellow-600 mt-1 bg-yellow-50 p-2 rounded">⚠️ Route not available - using standard fare</div>
                      )}
                      {formData.packageType === 'personal' && (
                        <div className="flex justify-between mt-1 text-sm sm:text-base"><span>Personal Group Charge:</span><span>+₹{(parseInt(formData.numberOfPeople) * 250).toLocaleString()}</span></div>
                      )}
                      {formData.roomType === "double" && (
                        <div className="flex justify-between mt-1 text-sm sm:text-base"><span>Double Sharing:</span><span>+₹{(parseInt(formData.numberOfPeople) * 500).toLocaleString()}</span></div>
                      )}
                      <div className="flex justify-between mt-2 pt-2 border-t border-pink-200"><span className="font-bold text-sm sm:text-base">Total Price:</span><span className="font-bold text-lg sm:text-xl text-pink-600">₹{prices.total.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs sm:text-sm mt-2"><span>Advance (40%):</span><span className="font-semibold text-pink-600">₹{prices.advance.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs sm:text-sm"><span>Balance:</span><span>₹{prices.balance.toLocaleString()}</span></div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Step 2: Personal Details</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="block text-sm font-medium mb-2">Full Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" placeholder="Enter full name" /></div>
                    <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" placeholder="Enter email" /></div>
                    <div><label className="block text-sm font-medium mb-2">Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" placeholder="Enter phone" /></div>
                    <div><label className="block text-sm font-medium mb-2">Aadhar Number *</label><input type="text" name="adharNumber" value={formData.adharNumber} onChange={handleInputChange} maxLength={12} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" placeholder="12 digit Aadhar number" /></div>
                    <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" /></div>
                    <div><label className="block text-sm font-medium mb-2">Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                  </div>

                  <div><label className="block text-sm font-medium mb-2">Special Requests</label><textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" /></div>

                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5" />
                      <div className="text-sm sm:text-base"><label>I accept the <button type="button" onClick={() => setShowTerms(true)} className="text-pink-600 underline">Terms and Conditions</button> *</label></div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && bookingId && (
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <FiCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">Booking Submitted Successfully! 🎉</h2>
                  <p className="text-sm sm:text-base text-gray-600">Thank you for booking with Avantika Travels. Our agent will contact you shortly.</p>
                  
                  <div className="overflow-x-auto">
                    <div ref={receiptRef} className="inline-block w-full">
                      <ReceiptContent 
                        formData={formData} 
                        packageData={packageData} 
                        prices={prices} 
                        bookingId={bookingId} 
                        siteData={siteData} 
                        currentDateTime={currentDateTime} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
                    <button onClick={downloadImage} disabled={generating} className="flex items-center justify-center gap-2 bg-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:bg-pink-700 text-sm sm:text-base">
                      {generating ? <><FiLoader className="animate-spin" /> Generating...</> : <><FiDownload /> Download Receipt</>}
                    </button>
                    {/* <button onClick={sendWhatsAppMessage} className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#20bd59] text-sm sm:text-base">
                      <FiMessageSquare /> Send on WhatsApp
                    </button> */}
                    <Link href="/" className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 text-center text-sm sm:text-base">Back to Home</Link>
                  </div>
                </div>
              )}

              {currentStep < 3 && (
                <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                  {currentStep > 1 && <button onClick={goToPreviousStep} className="px-4 sm:px-6 py-2 sm:py-3 border rounded-lg hover:bg-gray-50 text-sm sm:text-base">← Previous</button>}
                  <button onClick={goToNextStep}  disabled={loading}  className="px-6 sm:px-8 py-2 sm:py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 ml-auto text-sm sm:text-base">
                    {loading ? <><FiLoader className="animate-spin inline" /> Processing...</> : (currentStep === 1 ? "Continue →" : "Submit Booking →")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Receipt Modal - Responsive */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80" onClick={closeModal}>
          <div className="max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl overflow-auto relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-1.5 sm:p-2 shadow-lg z-10 hover:bg-gray-100">
              <FiX className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <div className="p-3 sm:p-6 md:p-8">
              <ReceiptContent 
                formData={formData} 
                packageData={packageData} 
                prices={prices} 
                bookingId={bookingId} 
                siteData={siteData} 
                currentDateTime={currentDateTime} 
              />
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-8 pt-4 sm:pt-8 border-t">
                <button onClick={downloadImage} disabled={generating} className="bg-pink-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:bg-pink-700 text-sm sm:text-base">
                  {generating ? "Generating..." : "Download Image"}
                </button>
                {/* <button onClick={sendWhatsAppMessage} className="bg-[#25D366] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#20bd59] flex items-center justify-center gap-2 text-sm sm:text-base">
                  <FiMessageSquare /> WhatsApp
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTerms(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-4 sm:p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Terms and Conditions</h2>
            <div className="whitespace-pre-line text-gray-600 text-sm sm:text-base">{TERMS_AND_CONDITIONS}</div>
            <button onClick={() => setShowTerms(false)} className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg">I understand</button>
          </div>
        </div>
      )}
    </>
  );
}