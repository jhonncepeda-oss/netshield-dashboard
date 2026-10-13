import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetShield - Consola Táctica de Ciberdefensa",
  description: "Portal de Ciberdefensa - Autenticación de grado militar con cifrado simétrico post-cuántico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-base text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
