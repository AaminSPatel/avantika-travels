"use client"

import { motion } from "framer-motion"
import PageHeader from "@/components/ui/page-header"
import { useSite } from "@/context/site-context"

export default function PrivacyPolicyPage() {
  const { siteData } = useSite()

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, including name, email address, phone number, travel preferences, and payment information when you book our services or contact us for inquiries.`,
      list: [
        "Personal identification information (Name, email, phone number)",
        "Travel preferences and requirements",
        "Payment and billing information",
        "Communication history with our team",
        "Website usage data through cookies",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to provide, maintain, and improve our services, process your bookings, and communicate with you about tours, promotions, and updates.`,
      list: [
        "Process and manage your tour bookings",
        "Send booking confirmations and travel updates",
        "Respond to your inquiries and provide customer support",
        "Send promotional communications (with your consent)",
        "Improve our website and services",
      ],
    },
    {
      title: "3. Information Sharing",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, such as hotels and transport providers, solely for the purpose of fulfilling your bookings.`,
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.`,
    },
    {
      title: "5. Cookies and Tracking",
      content: `Our website uses cookies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you use our website. You can control cookie settings through your browser preferences.`,
    },
    {
      title: "6. Your Rights",
      content: `You have the right to access, correct, or delete your personal information. You may also opt out of receiving promotional communications at any time by clicking the unsubscribe link in our emails or contacting us directly.`,
      list: [
        "Access your personal data",
        "Request correction of inaccurate data",
        "Request deletion of your data",
        "Opt-out of marketing communications",
        "Withdraw consent at any time",
      ],
    },
    {
      title: "7. Data Retention",
      content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Booking records are typically retained for 7 years for legal and accounting purposes.`,
    },
    {
      title: "8. Third-Party Links",
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.`,
    },
    {
      title: "9. Children's Privacy",
      content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
    },
    {
      title: "10. Contact Us",
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us:`,
      contact: true,
    },
  ]

  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="How we collect, use, and protect your personal information" />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-muted-foreground mb-8">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              <p className="text-muted-foreground mb-12 leading-relaxed">
                At {siteData.name}, we are committed to protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website or use our services.
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
                    <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>

                    {section.list && (
                      <ul className="space-y-2">
                        {section.list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-4 space-y-2 text-muted-foreground">
                        <p>
                          <strong>Email:</strong> {siteData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {siteData.phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {siteData.address}
                        </p>
                      </div>
                    )}
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
