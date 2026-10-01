import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/client/components/Footer";

// next/font hosts the font with the app, so there is no extra network request to Google at runtime
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata = { title: "CareSlot | Book a doctor", description: "Choose a treatment, pick a doctor, book a slot" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        {/* flex-1 on the content makes the footer sit at the bottom even on short pages like login */}
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
