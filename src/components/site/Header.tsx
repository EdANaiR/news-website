import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-[#ff0000ee]  text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="text-xl font-bold">
            HABERLER
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/son-dakika"
              className="hover:underline text-sm font-semibold"
            >
              SON DAKİKA
            </Link>
            <Link
              href="/son-dakika"
              className="hover:underline text-sm font-semibold"
            >
              GÜNDEM
            </Link>
            <Link
              href="/ekonomi"
              className="hover:underline text-sm font-semibold"
            >
              EKONOMİ
            </Link>
            <Link
              href="/spor"
              className="hover:underline text-sm font-semibold"
            >
              SPOR
            </Link>
            <Link
              href="/magazin"
              className="hover:underline text-sm font-semibold"
            >
              MAGAZİN
            </Link>
            <Link
              href="/magazin"
              className="hover:underline text-sm font-semibold"
            >
              DÜNYA
            </Link>
            <Link
              href="/magazin"
              className="hover:underline text-sm font-semibold"
            >
              ASTROLOJİ
            </Link>
            <Link
              href="/magazin"
              className="hover:underline text-sm font-semibold"
            ></Link>
            <Link
              href="/magazin"
              className="hover:underline text-sm font-semibold"
            >
              DİĞER
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Haber ara..."
              className="w-32 md:w-auto"
            />
            <Button size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
