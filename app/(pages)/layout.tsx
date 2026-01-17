import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { WhatsappButton } from "@/components/whatsapp-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted/30 ">
      <Navbar />
      <main>
        {children}
        <div className="flex flex-col items-center">
          <ScrollToTop />
          <WhatsappButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
