// components/seo/PackageSchema.js

export default function PackageSchema({ packageData,mainImage }) {
  if (!packageData) return null;

  const baseUrl = "https://avantikatravels.com";

  // Google ke liye Product (Trip/Package) Schema object
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Trip", // Travel packages ke liye Product ya Trip type best hai
    "name":  packageData.name,
    "image": [
      packageData.image ? `${mainImage}` : `${baseUrl}/pik4.avif`
    ],
    "description": packageData.description || "Best tour package for Mahakal Mandir and Ujjain sightseeing.",
    "brand": {
      "@type": "Brand",
      "name": "Avantika Travels"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/packages/${packageData.slug}`,
      "priceCurrency": "INR",
      "price": packageData.price || "0", // Server se aayi hui price
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    // Agar aapke paas reviews hain toh ise uncomment karein
    /*
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    }
    */
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}