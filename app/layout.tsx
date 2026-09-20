import type { Metadata } from "next";
import { cinzelDecorative } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Moneymaker",
  description: "An App by your friend Kaki to make gold in World of Warcraft",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-mist-800">
        {children}
      </body>
    </html>
  );
}
