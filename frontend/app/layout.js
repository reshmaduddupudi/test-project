import "./globals.css";

export const metadata = {
  title: "Todo App",
  description: "Next.js + FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
