export default function SchemaOrg() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RuzziStore",
    description: "Loja online de jogos digitais com as melhores ofertas e promoções",
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    logo: {
      "@type": "ImageObject",
      url: "/img/logoFirst.png",
      width: 128,
      height: 128,
    },
    sameAs: [
      "https://www.instagram.com/ruzzistore/",
      "https://wa.me/5511999999999",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
