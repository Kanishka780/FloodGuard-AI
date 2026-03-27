import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata = {
  title: "FloodGuard AI",
  description: "AI dashboard for flood prediction and risk management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
