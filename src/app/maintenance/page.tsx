import { Clock, AlertTriangle, Mail } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 rounded-lg bg-red-700 p-3 text-center text-white">
            <span className="mr-2 inline-block rounded bg-white px-2 py-1 text-sm font-bold text-red-700">
              SON DAKİKA
            </span>
            <span className="font-medium">Bakım Çalışması</span>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white shadow-lg">
            <div className="border-b bg-gray-50 p-6">
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h1 className="text-center text-2xl font-bold text-gray-900">
                  Sitemiz Geçici Olarak Bakımda
                </h1>
              </div>
            </div>

            <div className="p-6">
              <div className="prose mx-auto max-w-none">
                <p className="mb-6 text-center text-lg text-gray-700">
                  Değerli okuyucularımız, sitemiz şu anda bakım çalışması
                  nedeniyle geçici olarak erişime kapalıdır. En kısa sürede daha
                  iyi bir haber deneyimiyle sizlerle olacağız.
                </p>

                <div className="mb-6 rounded-lg border bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Tahmini Tamamlanma Süresi
                      </p>
                      <p className="text-gray-700">25 Mart 2025, 22:00</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-700" />
                      <div>
                        <p className="font-medium text-gray-900">
                          E-posta İletişim
                        </p>
                        <p className="text-gray-700">
                          info@guncelmanset.com.tr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t bg-gray-50 p-6 text-center">
              <p className="text-lg font-medium text-gray-800">
                Yeni ve geliştirilmiş haber deneyimimizle çok yakında
                buluşacağız!
              </p>
              <p className="mt-2 text-gray-600">
                Güncel Manşet ekibi olarak, size daha iyi hizmet verebilmek için
                çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Güncel Manşet. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
