import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BooksBridge | The Premium Book Protocol",
  description: "Create your premium book-trading portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-black text-slate-100 min-h-screen flex flex-col overflow-x-hidden selection:bg-[#FF4B2B]/30`}
      >
        {children}
      </body>
    </html>
  );
}
