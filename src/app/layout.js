import { Poppins } from "next/font/google"
import "./globals.css"
import { SiteProvider } from "@/context/site-context"
import ThemeProvider from "@/components/ui/theme-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import WhatsAppIcon from "@/components/ui/whatsapp-icon"
import { MetadataProvider } from "@/components/seo/metadata-provider"
import { StructuredData } from "@/components/seo/structured-data"
import SEOTracker from "@/components/analytics/seo-tracker"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E91E63",
}


/*  --primary: var(--dynamic-primary, oklch(64.908% 0.235 5.559));
  --primary-foreground: oklch(1 0 0);
  --primary-dark: oklch(0.5 0.25 0);
  --secondary: var(--dynamic-secondary, oklch(0.97 0 0));
  */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="wvy-XHnWdz5nBgkWv8T5oQJ6qDHnmaUD0KSYaNBz1Bk" />
      </head>
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
  )
}
