'use client'

import { useEffect } from 'react'
import { useSite } from '@/context/site-context'

export default function ThemeProvider({ children }) {
  const { siteData } = useSite()

  useEffect(() => {
    if (siteData?.theme) {
      const root = document.documentElement

      // Update CSS custom properties
      root.style.setProperty('--dynamic-primary', siteData.theme.primaryColor || '#000000')
      root.style.setProperty('--dynamic-secondary', siteData.theme.secondaryColor || '#ffffff')

      // Also update the Tailwind theme colors
      root.style.setProperty('--color-primary', siteData.theme.primaryColor || '#000000')
      root.style.setProperty('--color-secondary', siteData.theme.secondaryColor || '#ffffff')
    }
  }, [siteData])

  return <>{children}</>
}
