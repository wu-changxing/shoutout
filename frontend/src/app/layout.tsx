import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoutout - AI Video Generator",
  description: "Generate engaging videos from your content using AI",
  keywords: ["AI", "Video Generation", "Content Creation", "YouTube", "Automation"],
  authors: [
    { name: "Lance" },
    { name: "Aaron" },
    { name: "Sam" },
    { name: "Tanay" }
  ],
  openGraph: {
    title: "Shoutout - AI Video Generator",
    description: "Generate engaging videos from your content using AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shoutout - AI Video Generator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoutout - AI Video Generator",
    description: "Generate engaging videos from your content using AI",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
