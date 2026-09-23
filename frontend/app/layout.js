import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Todo & Calculator",
  description: "Next.js + FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/">Todos</Link>
          <Link href="/calculator">Calculator</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
