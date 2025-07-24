import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/ModernNavigation";
import { AuthProvider } from "@/components/AuthProvider";
import I18nProvider from "@/components/I18nProvider";

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
              <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                {children}
              </main>
              <footer className="w-full text-center text-xs text-muted-foreground py-4 border-t bg-background/80 backdrop-blur">
                © {new Date().getFullYear()} GTA 6 Mods. Design inspiré de
                Linear, Framer, Leonardo.ai.
              </footer>
            </ThemeProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
