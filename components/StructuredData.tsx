export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://rishikeshhedaoo.github.io/#website',
        url: 'https://rishikeshhedaoo.github.io',
        name: 'behave - Interactive Digital Experience',
        description: 'An immersive interactive particle visualization experience',
        publisher: {
          '@id': 'https://rishikeshhedaoo.github.io/#person',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://rishikeshhedaoo.github.io/#webpage',
        url: 'https://rishikeshhedaoo.github.io',
        name: 'behave - Interactive Digital Experience',
        isPartOf: {
          '@id': 'https://rishikeshhedaoo.github.io/#website',
        },
        about: {
          '@id': 'https://rishikeshhedaoo.github.io/#person',
        },
        description: 'An immersive interactive particle visualization experience. Explore dynamic 3D animations that respond to your movements in real-time.',
        inLanguage: 'en-US',
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: ['https://rishikeshhedaoo.github.io'],
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': 'https://rishikeshhedaoo.github.io/#person',
        name: 'Rishikesh Hedaoo',
        url: 'https://rishikeshhedaoo.github.io',
        image: {
          '@type': 'ImageObject',
          '@id': 'https://rishikeshhedaoo.github.io/#personlogo',
          url: 'https://rishikeshhedaoo.github.io/og-image.png',
        },
        sameAs: [
          'https://github.com/rishikeshhedaoo',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://rishikeshhedaoo.github.io/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://rishikeshhedaoo.github.io',
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
