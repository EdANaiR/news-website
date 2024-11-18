"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import GetMarket from "@/components/site/GetMarket";

const allCategories = [
  { id: "1badbcb4-1519-4d1e-9198-05d6e6e85808", name: "SON DAKIKA" },
  { id: "f7ebb650-c7c4-4bba-ae31-0f46be7d62c5", name: "SPOR" },
  { id: "4315c6a9-e626-4fbc-b5a3-12cb21e726e5", name: "TEKNOLOJI" },
  { id: "4055215d-8a3d-4616-969c-1761a352ea9b", name: "GÜNDEM" },
  { id: "1c053bec-87b0-42fd-969b-210288ce925a", name: "SIYASET" },
  { id: "67e4f0ff-ac83-48dd-b060-5a4e4ebee54b", name: "EKONOMI" },
  { id: "06a8171f-25f9-4959-9c2a-6649b70af42f", name: "ASTROLOJI" },
  { id: "45c2799c-2170-45b6-95e3-9a2e9746aa7f", name: "SAĞLIK" },
  { id: "0908ae29-a8d9-4afd-9279-aa61a93f9d2e", name: "MAGAZIN" },
  { id: "ea7fb0ad-9b9c-4d8c-8b53-2421c368e741", name: "Kültür ve Sanat" },
  { id: "f353ac34-6ba0-4842-8ced-6b3ec828cdd4", name: "Bilim" },
  { id: "79ca8a19-9fab-4864-879d-7872b0b78deb", name: "Tarih" },
  { id: "3e473960-eb89-4819-bb1f-8da661a0d611", name: "Otomobil" },
  { id: "834b9924-27b1-48c6-91a3-ada0cc2c1e66", name: "Çevre" },
  { id: "ff678c95-87bc-4ff6-9075-ca645b44ac2b", name: "Eğitim" },
  { id: "80905716-f6d6-4a07-bd8f-e52cb67e2130", name: "Dünya" },
];

const visibleCategories = allCategories.slice(0, 9);

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#611515] to-[#ad2323] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-2xl font-light tracking-wide">Güncel</span>
            <span className="text-2xl font-bold tracking-wider">MANŞET</span>
          </Link>
          <div className="hidden md:flex space-x-2 overflow-x-auto">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/news/category/${category.id}`}
                className="hover:underline text-xs font-semibold whitespace-nowrap hover:text-gray-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <Input
              type="search"
              placeholder="Haber ara..."
              className="w-24 md:w-32 h-8 bg-white/10 border-white/20 placeholder:text-white/60 text-white text-sm"
            />
            <Button size="sm" variant="ghost" className="hover:bg-white/10">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="md:hidden hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <GetMarket />
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#611515] to-[#ad2323] text-white">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/news/category/${category.id}`}
                  className="hover:underline text-sm font-semibold whitespace-nowrap hover:text-gray-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
