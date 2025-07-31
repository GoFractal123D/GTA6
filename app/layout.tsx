import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/ModernNavigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import I18nProvider from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GTA 6 Mods",
  description: "Plateforme moderne et immersive pour mods GTA 6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}
      >
        <I18nProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
