import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/context/site-context";
import ThemeProvider from "@/components/ui/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppIcon from "@/components/ui/whatsapp-icon";
//import { MetadataProvider } from "@/components/seo/metadata-provider";
import { StructuredData } from "@/components/seo/structured-data";

// 1. All SEO & Icons in Metadata Object
export const metadata = {
  metadataBase: new URL('https://avantikatravels.com'),
  title: {
    default: "Avantika Travels | Best Madhya Pradesh Tour Packages",
    template: "%s | Avantika Travels"
  },
  description: "Discover Madhya Pradesh tours, Ujjain pilgrimage packages, and India travel experiences with Avantika Travels. Best spiritual journeys and taxi services. Best travel services in ujjain, indore and dewas.",
  keywords: ["Mahakal Mandir tours", "Ujjain pilgrimage", "Madhya Pradesh travel", "Avantika Travels", "spiritual tours", "pilgrimage packages", "Ujjain tours", "Best travel for ujjain to indore", "best Indore tour packages", "Indore tours", "best travel", "best places to visit in madhya pradesh", "cheapest package to travel madhya pradesh", 'best avantika tours', 'best tour packages of avantika travels', 'bhasm aarti time at mahakal mandir', 'mahakal mandir darsan', 'sabse achhe travel packages', 'ujjain jane ke liye sabse badhiya travels', 'Best Madhya Pradesh Tour Packages'],
  
  // Icons configuration (Corrected)
  icons: {
    icon: [
      { url: '/favicon.ico',rel: 'icon' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    ],
  },
  
  manifest: '/site.webmanifest',

  openGraph: {
    title: "Avantika Travels | Discover Madhya Pradesh",
    description: "Avantika Travels - Your trusted travel partner for Mahakal Mandir Darshan.",
    url: 'https://avantikatravels.com',
    siteName: 'Avantika Travels',
    images: [{ url: '/pik2.avif', width: 1200, height: 630, alt: 'Avantika Travels' }],
    locale: 'en_IN',
    type: 'website',
  },

  verification: {
    google: "Kzya8PN69Pu0Wy8EeAaDq8-GKXBErwII4ela_A_nTqY",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9307e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
      <body className={`${poppins.variable} font-sans antialiased`}>
        <SiteProvider>
          <ThemeProvider>
              <StructuredData />
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppIcon />
          </ThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}