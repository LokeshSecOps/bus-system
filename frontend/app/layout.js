import "./globals.css";

export const metadata = {
  title: "RouteWise — Intercity Bus Schedules",
  description:
    "Find intercity bus schedules, departure times, and travel routes across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
