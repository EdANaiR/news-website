![www guncelmanset com tr_news](https://github.com/user-attachments/assets/190ccca0-de46-4fb7-a955-42596e788aaf)

![www guncelmanset com tr_news_0460c420-d325-483a-bb19-099bacb2f677_2025in-ansl-burlar-hava-ve-su-burlarna-byk-frsatlar-geliyor](https://github.com/user-attachments/assets/408aa511-af82-476a-995f-b306de37dd6d)

src/
├── app/                # Next.js rota ve sayfa yapılandırması
│   ├── middleware.ts   # Sayfa erişim kontrolleri
│   ├── ClientProvider.tsx  # İstemci sağlayıcısı
│   ├── layout.tsx      # Ana sayfa düzeni
│   ├── page.tsx        # Ana sayfa bileşeni
│   ├── globals.css     # Global stil dosyası
│   │
│   ├── admin/          # Yönetici paneli sayfaları
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── api/            # API rotaları
│   │   └── auth/
│   │       ├── login/route.ts
│   │       └── [...nextauth]/route.ts
│   │
│   ├── news/           # Haber sayfaları
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── category/[categoryId]/page.tsx
│   │   └── [newsId]/
│   │       ├── page.tsx
│   │       ├── error.tsx
│   │       └── [slug]/page.tsx
│   │
│   └── maintenance/    # Bakım modu sayfaları
│       ├── layout.tsx
│       └── page.tsx
│
├── components/         # React bileşenleri
│   ├── ErrorBoundary.tsx  # Hata sınırları bileşeni
│   │
│   ├── admin/          # Yönetici bileşenleri
│   │   ├── addNews.tsx
│   │   └── newsList.tsx
│   │
│   ├── site/           # Site geneli bileşenler
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HomeAstro.tsx
│   │   ├── HomeBreaking.tsx
│   │   ├── MainContent.tsx
│   │   ├── NewsDetail.tsx
│   │   └── NewsList.tsx
│   │
│   └── ui/             # Yeniden kullanılabilir UI bileşenleri
│       └── (çok sayıda UI bileşeni)
│
├── hooks/              # Özel React hook'ları
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/                # Yardımcı kütüphane ve utility fonksiyonları
│   ├── api.ts
│   ├── auth.ts
│   ├── finnhub-test.ts
│   ├── placeholder.ts
│   └── utils.ts
│
├── types/              # TypeScript tür tanımlamaları
│   └── next-auth.d.ts
│
└── utils/              # Genel utility fonksiyonları
