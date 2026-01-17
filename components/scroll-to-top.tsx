"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      size={"icon-lg"}
      variant={"outline"}
      onClick={scrollToTop}
      className={`fixed right-11 bottom-23 z-50 flex items-center gap-2 rounded-full transition-all hover:shadow-xl ${
        visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      <ChevronUp strokeWidth={2.75} className="h-6 w-6" />
    </Button>
  );
}
