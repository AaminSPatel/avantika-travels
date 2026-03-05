/**
 * Send WhatsApp message using Meta's WhatsApp Business Cloud API
 * This is called from the frontend after payment success
 */

const WHATSAPP_API_URL = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || '/api/whatsapp';

/**
 * Send payment success message to customer
 * @param {string} phoneNumber - Customer's phone number
 * @param {object} bookingData - Booking details
 * @param {object} paymentData - Payment details
 * @returns {Promise<object>} - API response
 */
export const sendPaymentSuccessMessage = async (phoneNumber, bookingData, paymentData) => {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        bookingData,
        paymentData,
        type: 'payment_success'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return await response.json();
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw error;
  }
};

/**
 * Send custom WhatsApp message
 * @param {string} phoneNumber - Customer's phone number
 * @param {string} message - Message text
 * @returns {Promise<object>} - API response
 */
export const sendCustomMessage = async (phoneNumber, message) => {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        message,
        type: 'custom'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return await response.json();
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw error;
  }
};

/**
 * Construct the payment success message
 */
export const constructPaymentSuccessMessage = (bookingData, paymentData) => {
  let message = `*🎉 Booking Confirmed! Thank You!*\n\n`;
  message += `Dear ${bookingData.name},\n\n`;
  message += `Your booking has been confirmed successfully! Here are your details:\n\n`;
  
  // Booking ID
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*📋 Booking ID:* ${bookingData.bookingId}\n`;
  
  // Package Details
  if (bookingData.packageName) {
    message += `*🧳 Package:* ${bookingData.packageName}\n`;
    message += `*📅 Travel Date:* ${new Date(bookingData.travelDate).toLocaleDateString('en-IN')}\n`;
    message += `*👥 Number of People:* ${bookingData.numberOfPeople}\n`;
  }
  
  // Service Details
  if (bookingData.serviceName) {
    message += `*🛎️ Service:* ${bookingData.serviceName}\n`;
  }
  
  // Payment Details
  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `*💳 Payment Details*\n`;
  message += `*✅ Amount Paid:* ₹${paymentData.amountPaid.toLocaleString('en-IN')}\n`;
  message += `*🆔 Payment ID:* ${paymentData.paymentId}\n`;
  message += `*📆 Payment Date:* ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}\n`;
  
  if (bookingData.balancePayment && bookingData.balancePayment > 0) {
    message += `*💰 Balance to Pay:* ₹${bookingData.balancePayment.toLocaleString('en-IN')}\n`;
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `*📞 Contact Us*\n`;
  message += `For any queries, please contact us.\n\n`;
  message += `Thank you for choosing Avantika Travels!\n`;
  message += `*Have a great journey! 🏃‍♂️💨*`;

  return message;
};
