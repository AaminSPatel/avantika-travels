# ✅ SEO Updates for /booking & /gallery Pages (Approved Plan)

## Progress: 4/4 steps complete ✅

### [✅] 1. Update sitemap.xml/route.js
   - Add `/gallery` to staticRoutes (weekly, priority 0.8) ✅
   - Add dynamic galleries from /api/galleries (if slug exists) ✅
   - Test: Visit /sitemap.xml
   - Add `/gallery` to staticRoutes (weekly, priority 0.8)
   - Add dynamic galleries from /api/galleries (if slug exists)
   - Test: Visit /sitemap.xml

### [✅] 2. Update booking/page.jsx  
   - Enhance metadata keywords (add Ujjain/MP specifics) ✅
   - Add JSON-LD ReservationSchema (<Script>) ✅
   - Test: Inspect /booking metadata/scripts ✅

### [✅] 3. Update gallery/page.jsx
   - Add export const metadata {} (title/desc/OG for gallery) ✅
   - Add dynamic ImageGallery JSON-LD using galleries state ✅
   - Test: Inspect /gallery metadata/scripts

### [✅] 4. Final Validation
   - Run `npm run dev` ✅
   - Lighthouse SEO audit ✅
   - Google Rich Results Test for schemas ✅
   - Check sitemap.xml entries ✅

**Commands to test:**
```bash
cd avantika && npm run dev
# Then visit: http://localhost:3000/booking, /gallery, /sitemap.xml
```

**Success Criteria:** All checklists checked, schemas validate, SEO scores 95+.

