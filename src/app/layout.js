import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/context/site-context";
import ThemeProvider from "@/components/ui/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppIcon from "@/components/ui/whatsapp-icon";
import { StructuredData } from "@/components/seo/structured-data";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Suspense } from "react";
import AIEnhancements from "@/components/seo/AIEnhancements";
import Script from "next/script"; // Import Script component

// Font Optimization
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
  preload: true,
});

// 1. Viewport Export (Separated for Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9307e' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  colorScheme: 'light dark',
};

// 2. Metadata Export
// ... imports

// 2026 SEO: Advanced Metadata Strategy
export const metadata = {
  metadataBase: new URL('https://avantikatravels.com'),
  
  // 1. Title Strategy: Brand + Primary Location Keyword
  title: {
    default: "Avantika Travels | Best Ujjain Taxi & Mahakal Tour Packages",
    template: "%s | Avantika Travels Ujjain" // हर पेज के टाइटल के पीछे 'Ujjain' जुड़ेगा (Local SEO Boost)
  },

  // 2. Description: Action-Oriented (Call to Action + Keywords)
  description: "Looking for the best travel agency in Ujjain? Book verified Mahakal Darshan taxi, Omkareshwar tour packages, and Indore airport pickup. Call +91-8720006707 for instant booking.",

  // 3. Keywords: Keep limited to top 10 (For Bing/Yandex mostly)
  keywords: ["Ujjain Taxi Service", "Mahakal Darshan Booking", "Indore to Ujjain Taxi", "Omkareshwar Tour", "Travel Agency Ujjain", "Avantika Travels"],

  // 4. Authors & Creator
  authors: [{ name: 'Avantika Travels Team', url: 'https://avantikatravels.com' }],
  creator: 'Avantika Travels',
  publisher: 'Avantika Travels MP',

  // 5. Icons & Manifest
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

  // 6. Robots (Control how Google shows your snippets)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 7. OpenGraph (Social Media Sharing)
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://avantikatravels.com',
    siteName: 'Avantika Travels - Ujjain & MP Tourism',
    title: 'Avantika Travels | Best Taxi & Tour Service in Ujjain',
    description: 'Planning a trip to Mahakal? Get the best rates for Ujjain Darshan, Omkareshwar, and Indore Taxi services. Book now!',
    images: [
      {
        url: '/pik2.avif', // Make sure this image has text like "Best Ujjain Tours" on it
        width: 1200,
        height: 630,
        alt: 'Avantika Travels Ujjain Tour Packages',
      }
    ],
  },

  // 8. Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Avantika Travels | Ujjain Tour Experts',
    description: 'Book Mahakal Darshan Taxi & MP Tour Packages. Reliable & Affordable.',
    images: ['/pik2.avif'],
    creator: '@avantikatravels', // Add your handle if you have one
  },

  // 9. Local SEO & Geo Tags (Crucial for Maps Ranking)
  other: {
    'geo.region': 'IN-MP',
    'geo.placename': 'Ujjain',
    'geo.position': '23.1765;75.7885',
    'ICBM': '23.1765, 75.7885',
    'google-site-verification': "Kzya8PN69Pu0Wy8EeAaDq8-GKXBErwII4ela_A_nTqY",
    
    // Voice Search Optimization Tags
    'format-detection': 'telephone=no', // Prevents random numbers from becoming links
  },

  // 10. Canonical URL (Prevents Duplicate Content Issues)
  alternates: {
    canonical: './',
  }
};

// ... Rest of your component code

const defaultSiteData = {
  name: "Avantika Travels",
  tagline: "Discover the Divine Beauty of Madhya Pradesh",
  // ... (Keep your existing data structure same) ...
  contactInfo: { 
    email: "info@avanikatravels.com",
    phone: "+91 8720006707",
    // ...
  },
  // ...
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${poppins.variable}`}>
      <head>
        {/* Manual links removed to avoid conflicts with Metadata API */}
        
        {/* 6. Optimized Script Loading for Consent/Analytics */}
        <Script id="consent-mode" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
          `}
        </Script>
        <script src="https://cdn.counter.dev/script.js" data-id="4118ced0-591b-4232-9a15-f6fd72ffe86a" data-utcoffset="6"></script>
      </head>

      <body className={`${poppins.variable} font-sans antialiased`}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white text-primary">
            <div className="text-lg font-bold animate-pulse">Loading Avantika Travels...</div>
          </div>
        }>
          <SiteProvider>
            <ThemeProvider>
              <StructuredData />
              <AIEnhancements pageType="global" data={defaultSiteData} />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <WhatsAppIcon />
            </ThemeProvider>
          </SiteProvider>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        </Suspense>
      </body>
    </html>
  );
}