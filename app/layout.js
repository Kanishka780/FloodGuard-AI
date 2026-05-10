import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata = {
  title: "FloodGuard AI",
  description: "AI dashboard for flood prediction and risk management",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
