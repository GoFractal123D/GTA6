"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/ModernNavigation";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages où on ne veut pas afficher la navigation et le footer
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navigation />}
      <main className="flex-1 relative">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
