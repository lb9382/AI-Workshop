import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lilli-Lyn",
  description: "Personal site of Lilli-Lyn, a senior at UH Manoa studying second language studies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
