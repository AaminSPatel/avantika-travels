"use client"

import { motion } from "framer-motion"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"

export default function TermsPage() {
  const { siteData } = useSite()

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using the ${siteData.name} website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.`,
    },
    {
      title: "2. Booking and Reservations",
      content: `All bookings are subject to availability and confirmation. A booking is considered confirmed only after receipt of the required deposit or full payment and issuance of a confirmation voucher by ${siteData.name}. Prices are subject to change without prior notice until a booking is confirmed.`,
    },
    {
      title: "3. Payment Terms",
      content: `A deposit of 30% of the total tour cost is required at the time of booking. The balance payment must be made at least 15 days before the tour departure date. For bookings made within 15 days of departure, full payment is required at the time of booking.`,
    },
    {
      title: "4. Cancellation Policy",
      content: `Cancellations made 30 days or more before departure: Full refund minus processing fee. Cancellations made 15-29 days before departure: 50% refund. Cancellations made 7-14 days before departure: 25% refund. Cancellations made less than 7 days before departure: No refund.`,
    },
    {
      title: "5. Travel Documents",
      content: `Travelers are responsible for ensuring they have valid identification and any required travel documents. ${siteData.name} is not responsible for any issues arising from invalid or missing travel documents.`,
    },
    {
      title: "6. Travel Insurance",
      content: `We strongly recommend that all travelers obtain comprehensive travel insurance covering trip cancellation, medical emergencies, personal accidents, and loss of baggage. ${siteData.name} is not liable for any losses not covered by insurance.`,
    },
    {
      title: "7. Itinerary Changes",
      content: `While we make every effort to follow the planned itinerary, ${siteData.name} reserves the right to modify routes, accommodations, or activities due to unforeseen circumstances, weather conditions, or safety concerns. Such changes will be communicated promptly.`,
    },
    {
      title: "8. Liability",
      content: `${siteData.name} acts as an intermediary between travelers and service providers. We are not liable for any injury, damage, loss, delay, or inconvenience caused by third-party service providers or circumstances beyond our control.`,
    },
    {
      title: "9. Code of Conduct",
      content: `Travelers are expected to respect local customs, traditions, and religious practices, especially when visiting temples and religious sites. ${siteData.name} reserves the right to terminate services for travelers who engage in inappropriate behavior.`,
    },
    {
      title: "10. Contact Information",
      content: `For any questions regarding these terms and conditions, please contact us at ${siteData.email} or call us at ${siteData.phone}.`,
    },
  ]

  return (
    <>
      <PageHeader title="Terms and Conditions" subtitle="Please read these terms carefully before using our services" />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-muted-foreground mb-8">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-muted rounded-2xl p-6 md:p-8"
                  >
                    <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
