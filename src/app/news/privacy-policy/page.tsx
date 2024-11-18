export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>
        <p className="mb-4">Son güncelleme tarihi: 18 Kasım 2024</p>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              1. Toplanan Bilgiler
            </h2>
            <p>
              Sitemizi ziyaret ettiğinizde, aşağıdaki türde bilgileri otomatik
              olarak toplayabiliriz:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>Kullanım Bilgileri:</strong> Sitemizde gezinirken
                görüntülediğiniz sayfalar, tıkladığınız bağlantılar ve
                etkileşimde bulunduğunuz diğer içerikler gibi bilgiler.
              </li>
              <li>
                <strong>Cihaz Bilgileri:</strong> IP adresi, tarayıcı türü ve
                sürümü, işletim sistemi, ekran çözünürlüğü gibi cihazınıza ait
                teknik bilgiler.
              </li>
              <li>
                <strong>Konum Bilgileri:</strong> Genel coğrafi konum (ülke veya
                şehir düzeyinde).
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              2. Bilgi Toplama Yöntemleri
            </h2>
            <p>Bilgileri aşağıdaki yöntemlerle topluyoruz:</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>Çerezler (Cookies):</strong> Sitemiz, kullanıcı
                deneyimini iyileştirmek ve site kullanımını analiz etmek için
                çerezler kullanmaktadır.
              </li>
              <li>
                <strong>Sunucu Günlükleri:</strong> Sunucularımız, Sitemize
                yapılan her ziyareti otomatik olarak kaydeder.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Google AdSense</h2>
            <p>
              Sitemizde reklam göstermek için Google AdSense kullanıyoruz.
              Google AdSense, ilgi alanlarınıza dayalı reklamlar sunmak için
              çerezler kullanabilir. Bu konuda daha fazla bilgi için{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-blue-600 hover:underline"
              >
                Google'ın gizlilik politikasını
              </a>{" "}
              inceleyebilirsiniz.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
