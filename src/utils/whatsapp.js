/**
 * AiSensy WhatsApp API Utilities - Admin Follow-up Feature
 * Backend: localhost:5000/api/whatsapp/send
 */

const WHATSAPP_API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/whatsapp/send`;

/** Send payment success (existing) */
export const sendPaymentSuccessMessage = async (phoneNumber, bookingData, paymentData) => {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phoneNumber, bookingData, paymentData, type: 'payment_success'})
    });
    if (!response.ok) throw new Error('Send failed');
    return response.json();
  } catch (error) {
    console.error('WhatsApp payment error:', error);
    throw error;
  }
};



/** Admin follow-up messages for bookings */
export const sendFollowupMessage = async (userName, packageName, packageDuration, pickupPoint, phoneNumber, bookingData = null) => {
  try {
    const body = {userName, packageName, packageDuration, pickupPoint, phoneNumber,type: 'followup'};
    if (bookingData) body.bookingData = bookingData;
console.log('body', body);

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'WhatsApp send failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Follow-up message error:', error);
    throw error;
  }
};

