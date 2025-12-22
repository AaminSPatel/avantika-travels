import { Poppins } from "next/font/google"
import "./globals.css"
import { SiteProvider } from "@/context/site-context"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Avantika Travels | Explore Madhya Pradesh - Ujjain, Indore, Dewas",
  description:
    "Experience the spiritual essence and cultural heritage of Madhya Pradesh with Avantika Travels. Pilgrimages to Mahakal Mandir, tours across Ujjain, Indore, and Dewas.",
  keywords:
    "Avantika Travels, Madhya Pradesh tours, Ujjain pilgrimage, Mahakal Temple, Indore tours, Dewas travel, MP tourism, spiritual tours India",
  openGraph: {
    title: "Avantika Travels | Discover the Divine Beauty of Madhya Pradesh",
    description: "Your trusted travel partner for exploring the spiritual and cultural heritage of Madhya Pradesh.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avantika Travels | Madhya Pradesh Tours",
    description: "Experience the divine beauty of Madhya Pradesh with our curated travel packages.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E91E63",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <SiteProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  )
}
