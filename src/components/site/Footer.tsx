import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Rss } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Hakkımızda</h3>
            <p className="text-sm leading-relaxed">
              GÜNCEL MANŞET, Türkiye'nin en güvenilir ve tarafsız haber
              kaynağıdır. 7/24 kesintisiz yayın ilkesiyle, güncel olayları,
              politikayı, ekonomiyi, sporu ve daha fazlasını sizlere sunuyoruz.
              Doğru, hızlı ve objektif habercilik anlayışımızla, toplumu
              bilgilendirmeyi ve demokrasiyi güçlendirmeyi amaçlıyoruz.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/gundem"
                  className="hover:text-white transition-colors"
                >
                  Gündem
                </Link>
              </li>
              <li>
                <Link
                  href="/ekonomi"
                  className="hover:text-white transition-colors"
                >
                  Ekonomi
                </Link>
              </li>
              <li>
                <Link
                  href="/spor"
                  className="hover:text-white transition-colors"
                >
                  Spor
                </Link>
              </li>
              <li>
                <Link
                  href="/teknoloji"
                  className="hover:text-white transition-colors"
                >
                  Teknoloji
                </Link>
              </li>
              <li>
                <Link
                  href="/kultur-sanat"
                  className="hover:text-white transition-colors"
                >
                  Kültür Sanat
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">İletişim</h3>
            <p className="text-sm mb-2">Adres: Ankara</p>

            <p className="text-sm mb-2">E-posta: info@guncelmanset.com</p>
            <p className="text-sm">Whatsapp İhbar: +90 555 123 4567</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              Bültenimize Katılın
            </h3>
            <p className="text-sm mb-4">Güncel haberleri e-posta ile alın</p>
            <form className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-gray-800 text-white border-gray-700"
              />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Abone Ol
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © 2024 GÜNCEL MANŞET. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-6">
            <Link
              href="/hakkimizda"
              className="text-sm hover:text-white transition-colors"
            >
              Hakkımızda
            </Link>

            <Link
              href="/iletisim"
              className="text-sm hover:text-white transition-colors"
            >
              İletişim
            </Link>
            <Link
              href="/news/privacy-policy"
              className="text-sm hover:text-white transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/kullanim-sartlari"
              className="text-sm hover:text-white transition-colors"
            >
              Kullanım Şartları
            </Link>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-8">
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Facebook size={24} />
          </Link>
          <Link
            href="https://x.com/GuncelM6883"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Youtube size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Rss size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
};
