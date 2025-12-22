"use client"

import { SiteProvider } from "@/context/site-context"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function ClientLayout({ children }) {
  return (
    <SiteProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SiteProvider>
  )
}
