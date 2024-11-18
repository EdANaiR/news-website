import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Hakkımızda</h3>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <p className="text-sm">Email: info@haberler.com</p>
            <p className="text-sm">Telefon: +90 123 456 7890</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-red-400">
                Facebook
              </Link>
              <Link href="#" className="hover:text-red-400">
                Twitter
              </Link>
              <Link href="#" className="hover:text-red-400">
                Instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © 2024 GÜNCEL MANŞET. Tüm hakları saklıdır.
          <Link href="news/privacy-policy" className="ml-2 hover:text-red-400">
            Gizlilik Politikası
          </Link>
        </div>
      </div>
    </footer>
  );
};
