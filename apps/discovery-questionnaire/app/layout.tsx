import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP Discovery Questionnaire",
  description: "Discovery questionnaire for NetSuite vs Business Central evaluation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
