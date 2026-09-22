import type { Metadata } from "next";
import "@fontsource/chewy";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniela Sarahi Yanez Baldias",
  description: "Una página especial para Daniela Sarahi Yanez Baldias",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
