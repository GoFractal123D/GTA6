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
    <>
      {!isAuthPage && <Navigation />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
