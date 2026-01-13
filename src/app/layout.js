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
    default: "Avantika Travels | Best Mahakal Mandir & MP Tour Packages",
    template: "%s | Avantika Travels"
  },
  description: "Experience the divine beauty of Mahakal Mandir with Avantika Travels. Best pilgrimage tours and Ujjain-Indore taxi services.",
  keywords: ["travels","tour","ujjain travels","indore travels","avantika","Avantika Travels", "Mahakal Mandir Ujjain", "Ujjain Tour Packages", "Indore Travels", "Travels in Ujjain", "Travels"],
  
  // Icons configuration (Corrected)
  icons: {
    icon: [
      { url: '/favicon.ico' },
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
            <MetadataProvider>
              <StructuredData />
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppIcon />
            </MetadataProvider>
          </ThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}