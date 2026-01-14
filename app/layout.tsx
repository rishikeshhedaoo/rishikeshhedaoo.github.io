import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "behave - Interactive Digital Experience",
    template: "%s | behave"
  },
  description: "An immersive interactive particle visualization experience. Explore dynamic 3D animations that respond to your movements in real-time.",
  keywords: [
    "interactive design",
    "3D visualization",
    "particle animation",
    "WebGL",
    "Three.js",
    "creative coding",
    "digital art",
    "portfolio",
    "web experience",
    "interactive art"
  ],
  authors: [{ name: "Rishikesh Hedaoo" }],
  creator: "Rishikesh Hedaoo",
  publisher: "Rishikesh Hedaoo",
  metadataBase: new URL("https://rishikeshhedaoo.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rishikeshhedaoo.github.io",
    title: "behave - Interactive Digital Experience",
    description: "An immersive interactive particle visualization experience. Explore dynamic 3D animations that respond to your movements in real-time.",
    siteName: "behave",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "behave - Interactive particle visualization",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "behave - Interactive Digital Experience",
    description: "An immersive interactive particle visualization experience. Explore dynamic 3D animations that respond to your movements in real-time.",
    images: ["/og-image.png"],
    creator: "@rishikeshhedaoo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-site-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@800&family=Righteous&family=Orbitron:wght@900&family=Audiowide&family=Bungee&family=Archivo+Black&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
