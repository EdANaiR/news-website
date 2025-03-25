![www guncelmanset com tr_news](https://github.com/user-attachments/assets/190ccca0-de46-4fb7-a955-42596e788aaf)

![www guncelmanset com tr_news_0460c420-d325-483a-bb19-099bacb2f677_2025in-ansl-burlar-hava-ve-su-burlarna-byk-frsatlar-geliyor](https://github.com/user-attachments/assets/408aa511-af82-476a-995f-b306de37dd6d)

```
#h3 Proje Yapısı
📦 NEWS-WEBSITE
│── 📂 .next                 # Next.js tarafından oluşturulan derleme dosyaları
│── 📂 node_modules          # Proje bağımlılıkları
│── 📂 public                # Genel statik dosyalar (favicon, resimler)
│── 📂 src                   # Ana kaynak kodları
│   ├── 📂 app               # Next.js sayfa ve rota yapılandırması
│   │   ├── 📄 middleware.ts # Sayfa erişim kontrolleri
│   │   ├── 📄 ClientProvider.tsx # İstemci sağlayıcısı
│   │   ├── 📄 favicon.ico   # Web sitesi favicon'u
│   │   ├── 📄 globals.css   # Global stil dosyası
│   │   ├── 📄 layout.tsx    # Ana sayfa düzeni
│   │   ├── 📄 page.tsx      # Ana sayfa bileşeni
│   │   │
│   │   ├── 📂 admin         # Yönetici paneli
│   │   │   ├── 📄 layout.tsx
│   │   │   ├── 📄 page.tsx
│   │   │   └── 📂 login
│   │   │       └── 📄 page.tsx
│   │   │
│   │   ├── 📂 api           # API rotaları
│   │   │   └── 📂 auth
│   │   │       ├── 📂 login
│   │   │       │   └── 📄 route.ts
│   │   │       └── 📂 [...nextauth]
│   │   │           └── 📄 route.ts
│   │   │
│   │   ├── 📂 news          # Haber sayfaları
│   │   │   ├── 📄 layout.tsx
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📂 category
│   │   │   │   └── 📂 [categoryId]
│   │   │   │       └── 📄 page.tsx
│   │   │   └── 📂 [newsId]
│   │   │       ├── 📄 page.tsx
│   │   │       ├── 📄 error.tsx
│   │   │       ├── 📄 loading.tsx
│   │   │       └── 📂 [slug]
│   │   │           └── 📄 page.tsx
│   │   │
│   │   └── 📂 maintenance   # Bakım modu sayfaları
│   │       ├── 📄 layout.tsx
│   │       └── 📄 page.tsx
│   │
│   ├── 📂 components        # React bileşenleri
│   │   ├── 📄 ErrorBoundary.tsx  # Hata sınırları
│   │   │
│   │   ├── 📂 admin         # Yönetici bileşenleri
│   │   │   ├── 📄 addNews.tsx
│   │   │   └── 📄 newsList.tsx
│   │   │
│   │   ├── 📂 site          # Site geneli bileşenler
│   │   │   ├── 📄 Footer.tsx
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 HomeAstro.tsx
│   │   │   ├── 📄 HomeBreaking.tsx
│   │   │   ├── 📄 MainContent.tsx
│   │   │   ├── 📄 NewsDetail.tsx
│   │   │   └── 📄 NewsList.tsx
│   │   │
│   │   └── 📂 ui            # Yeniden kullanılabilir UI bileşenleri
│   │       └── (çok sayıda UI bileşeni)
│   │
│   ├── 📂 hooks             # Özel React hook'ları
│   │   ├── 📄 use-mobile.tsx
│   │   └── 📄 use-toast.ts
│   │
│   ├── 📂 lib               # Yardımcı kütüphane ve utility fonksiyonları
│   │   ├── 📄 api.ts
│   │   ├── 📄 auth.ts
│   │   ├── 📄 finnhub-test.ts
│   │   ├── 📄 placeholder.ts
│   │   └── 📄 utils.ts
│   │
│   ├── 📂 types             # TypeScript tür tanımlamaları
│   │   └── 📄 next-auth.d.ts
│   │
│   └── 📂 utils             # Genel utility fonksiyonları
│
│── 📄 .env                  # Çevre değişkenleri
│── 📄 .gitignore            # Git ignore dosyası
│── 📄 next.config.mjs       # Next.js yapılandırma dosyası
│── 📄 package.json          # Proje bağımlılıkları ve scriptler
│── 📄 README.md             # Proje dokümantasyonu
│── 📄 tailwind.config.js    # Tailwind CSS yapılandırması
└── 📄 tsconfig.json         # TypeScript yapılandırma dosyasıProje Yapısı
```
