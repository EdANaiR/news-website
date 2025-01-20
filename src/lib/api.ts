const baseUrl = "https://newsapi-nxxa.onrender.com";

export interface AddCategoryDto {
  name: string;
}

// api.ts

export interface Category {
  categoryId: string;
  name: string;
  newsArticles: any | null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      "https://newsapi-nxxa.onrender.com/api/Categories",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // 60 saniyede bir api'yi doğrula
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return defaultCategories;
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch(
      "https://newsapi-nxxa.onrender.com/api/Categories${id}",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export interface NewsSummaryDto {
  newsId: string;
  title: string;
  imagePath: string;
  publishedDate: string;
  shortDescription: string;
}
export async function getNewsByCategory(
  categoryId: string,
  page = 1,
  pageSize = 10
): Promise<NewsSummaryDto[]> {
  try {
    const response = await fetch(
      `https://newsapi-nxxa.onrender.com/api/News/category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (response.status === 404) {
      console.warn(`No news found for category ${categoryId}`);
      return [];
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsSummaryDto[] = await response.json();
    return data.map((item) => ({
      ...item,
      imagePath: `${baseUrl}${item.imagePath}`,
    }));
  } catch (error) {
    console.error("There was a problem fetching the news:", error);
    return defaultNews[categoryId] || [];
  }
}

export async function addCategory(category: AddCategoryDto): Promise<Category> {
  try {
    const response = await fetch(
      "https://newsapi-nxxa.onrender.com/api/Categories",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

export interface NewsItem {
  newsId: string;
  title: string;
  shortDescription: string;
  content: string;
  keywords: string[];
  publishedDate?: string;
  images: ImageItem[];
  categoryId: string;
}

export interface ImageItem {
  imageId: string;
  imagePath: string;
  title: string;
}

export interface AddNewsDto {
  title: string;
  shortDescription: string;
  content: string;
  keywords: string[];
  publishedDate: string;
  categoryId: string;
  images: File[];
}

interface NewsResponse {
  $id: string;
  $values: NewsItem[];
}

export async function addNews(newsData: AddNewsDto): Promise<NewsItem> {
  try {
    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("shortDescription", newsData.shortDescription);
    formData.append("content", newsData.content);
    const keywordsString = newsData.keywords.join(", ");
    formData.append("keywords", keywordsString);
    formData.append("publishedDate", newsData.publishedDate);
    formData.append("categoryId", newsData.categoryId);

    newsData.images.forEach((image) => {
      formData.append(`Images`, image);
    });

    const response = await fetch("https://newsapi-nxxa.onrender.com/api/News", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding news:", error);
    throw error;
  }
}
export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch("https://newsapi-nxxa.onrender.com/api/News", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data.$values.map((item) => ({
      ...item,
      images: item.images.map((image) => ({
        ...image,
        imagePath: `${baseUrl}${image.imagePath}`,
      })),
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export interface CarouselNewsItem {
  newsId: string;
  title: string;
  imageUrl: string;
}

export async function getCarouselNews(): Promise<CarouselNewsItem[]> {
  const baseUrl = "https://newsapi-nxxa.onrender.com"; // Backend'inizin base URL'si

  try {
    const response = await fetch(
      `https://newsapi-nxxa.onrender.com/api/News/carousel`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const carouselItems = data?.$values ?? data;

    if (Array.isArray(carouselItems) && carouselItems.length > 0) {
      return carouselItems.map((item: any) => ({
        newsId: item.newsId.toString(),
        title: item.title,
        imageUrl: `${baseUrl}${item.imageUrl}`, // Tam URL oluşturma
      }));
    }

    console.warn("Unexpected or empty data structure for carousel news:", data);
    throw new Error("Invalid or empty carousel data");
  } catch (error) {
    console.error("Error fetching carousel news:", error);
    throw error;
  }
}

// Haber detaylarını temsil eden arayüz
export interface NewsDetailDto {
  newsId: string;
  title: string;
  shortDescription: string;
  content: string;
  keywords: string[];
  publishedDate: string;
  imagePaths: string[];
  categoryId: string;
}

export async function getNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `https://newsapi-nxxa.onrender.com/api/news/${newsId}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch news detail: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      ...data,
      imagePaths: data.imagePaths.map((path: string) => `${baseUrl}${path}`),
    } as NewsDetailDto;
  } catch (error) {
    console.error("Error fetching news detail:", error);

    return defaultNewsDetails[
      Math.floor(Math.random() * defaultNewsDetails.length)
    ];
  }
}

export interface AstrologyNews {
  newsId: string;
  title: string;
  publishedDate: string;
}

export async function getAstrologyNews(): Promise<AstrologyNews[]> {
  try {
    const response = await fetch(
      "https://newsapi-nxxa.onrender.com/api/News/astroloji-news",
      {
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch astrology news");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : defaultAstrologyNews;
  } catch (error) {
    console.error("Error fetching astrology news:", error);
    return defaultAstrologyNews;
  }
}

export async function getAstrologyNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `https://newsapi-nxxa.onrender.com/api/News/astroloji-news/${newsId}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch astrology news detail: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data as NewsDetailDto;
  } catch (error) {
    console.error("Error fetching astrology news detail:", error);
    return null;
  }
}

export interface BreakingNews {
  newsId: string;
  title: string;
}

export async function getBreakingNews(): Promise<BreakingNews[]> {
  try {
    const response = await fetch(
      "https://newsapi-nxxa.onrender.com/api/News/breaking-news",
      {
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch breaking news");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : defaultBreakingNews;
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return defaultBreakingNews;
  }
}

export async function getBreakingNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `https://newsapi-nxxa.onrender.com/api/News/breaking-news/${newsId}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch breaking news detail: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data as NewsDetailDto;
  } catch (error) {
    console.error("Error fetching breaking news detail:", error);
    return null;
  }
}

// Api'ye bağlanmadığında gelecek olan default veriler //

const defaultCategories: Category[] = [
  { categoryId: "1", name: "Gündem", newsArticles: null },
  { categoryId: "2", name: "Spor", newsArticles: null },
  { categoryId: "3", name: "Ekonomi", newsArticles: null },
  { categoryId: "4", name: "Son Dakika", newsArticles: null },
  { categoryId: "5", name: "Teknoloji", newsArticles: null },
  { categoryId: "6", name: "Siyaset", newsArticles: null },
  { categoryId: "7", name: "Astroloji", newsArticles: null },
];

const defaultNews: { [key: string]: NewsSummaryDto[] } = {
  "1": [
    {
      newsId: "1",
      title: "Cumhurbaşkanı Erdoğan'dan Ekonomi ile İlgili Yeni Açıklama",
      imagePath: "/default9.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Cumhurbaşkanı Recep Tayyip Erdoğan, enflasyon ve döviz kurlarına yönelik yeni ekonomik tedbirleri açıkladı.",
    },
    {
      newsId: "2",
      title: "Milli Eğitim Bakanlığı'ndan Okullarda Yeni Düzenleme",
      imagePath: "/default8.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Milli Eğitim Bakanlığı, 2024 yılı için ilkokul ve lise müfredatında değişiklikler yapılacağını duyurdu.",
    },
    {
      newsId: "3",
      title: "İstanbul'da Trafik Yoğunluğu Rekor Seviyeye Ulaştı",
      imagePath: "/default10.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Sabah saatlerinde yaşanan trafik kazaları İstanbul genelinde trafiği durma noktasına getirdi.",
    },
  ],
  "2": [
    {
      newsId: "4",
      title:
        "Galatasaray, Şampiyonlar Ligi'nde Zorlu Rakibine Karşı Sahaya Çıkıyor",
      imagePath: "/default11.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Galatasaray, bu akşam Şampiyonlar Ligi grup maçında Avrupa'nın güçlü ekiplerinden biriyle karşılaşacak.",
    },
    {
      newsId: "5",
      title: "A Milli Futbol Takımı, 2024 Avrupa Şampiyonası'na Hazırlanıyor",
      imagePath: "/default12.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Türkiye, 2024 Avrupa Şampiyonası elemelerinde kritik bir maça çıkmaya hazırlanıyor. Teknik direktör kadroyu açıkladı.",
    },
    {
      newsId: "6",
      title: "Fenerbahçe, Süper Lig'de Liderlik Koltuğunu Bırakmıyor",
      imagePath: "/default13.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Sarı-lacivertli ekip, dün akşam oynanan maçta aldığı galibiyetle Süper Lig'deki liderliğini sürdürdü.",
    },
  ],
  "3": [
    {
      newsId: "7",
      title: "Merkez Bankası Faiz Kararını Açıkladı",
      imagePath: "/default14.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Türkiye Cumhuriyet Merkez Bankası, politika faizini artırarak enflasyonla mücadeleye devam ediyor.",
    },
    {
      newsId: "8",
      title: "Dolar/TL Kurunda Hareketlilik Sürüyor",
      imagePath: "/default15.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Dolar/TL kuru, küresel piyasalardaki gelişmelerin ardından dalgalı seyrini sürdürüyor. Uzmanlar piyasayı değerlendirdi.",
    },
    {
      newsId: "9",
      title: "Asgari Ücret Zammı İçin Gözler Aralık Ayında",
      imagePath: "/default16.png",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Hükümet ve sendikalar arasında yapılacak görüşmelerde asgari ücrete yapılacak zam oranı belirlenecek.",
    },
  ],
  "5": [
    {
      newsId: "10",
      title:
        "Türkiye'nin İlk Yerli Uydusu TÜRKSAT 6A Fırlatılmaya Hazırlanıyor",
      imagePath: "/default17.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Türkiye'nin yerli ve milli uydusu TÜRKSAT 6A, uzay yolculuğu için son test aşamasında.",
    },
    {
      newsId: "11",
      title: "Yerli Elektrikli Otomobil Togg, Avrupa Pazarına Açılıyor",
      imagePath: "/default18.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Togg, Türkiye’deki üretim kapasitesini artırırken, Avrupa pazarına giriş için stratejilerini duyurdu.",
    },
    {
      newsId: "12",
      title: "Yapay Zeka Kullanımı Türkiye'de Hızla Artıyor",
      imagePath: "/default19.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Yapay zeka teknolojileri, sağlık ve eğitim başta olmak üzere birçok sektörde kullanılmaya başlandı.",
    },
  ],
  "6": [
    {
      newsId: "13",
      title: "Cumhurbaşkanı Erdoğan, Yeni Ekonomik Paketini Açıkladı",
      imagePath: "/default20.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "Cumhurbaşkanı Erdoğan, Türkiye'nin ekonomik kalkınmasını hızlandıracak yeni ekonomik paketini kamuoyuna sundu.",
    },
    {
      newsId: "14",
      title: "Kılıçdaroğlu'ndan Hükümete Eleştiriler",
      imagePath: "/default21.jpg",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "CHP Genel Başkanı Kemal Kılıçdaroğlu, hükümetin ekonomi politikalarını eleştirerek alternatif çözümler sundu.",
    },
    {
      newsId: "15",
      title: "MHP Lideri Bahçeli'den Seçim Süreciyle İlgili Açıklamalar",
      imagePath: "/default22.webp",
      publishedDate: new Date().toISOString(),
      shortDescription:
        "MHP Genel Başkanı Devlet Bahçeli, yaklaşan seçim süreciyle ilgili olarak parti stratejilerini paylaştı.",
    },
  ],
};

// Default carousel haberler
export const defaultCarouselNews: CarouselNewsItem[] = [
  {
    newsId: "1",
    title:
      "Cumhurbaşkanı Erdoğan: İnsanlık Filistin ve Lübnan'daki Zulümlere Karşı Sessiz Kalmamalı",
    imageUrl: "/default1.jpg",
  },
  {
    newsId: "2",
    title:
      "Yenidoğan Çetesi Davasında Ara Karar: Sanıkların Tutukluluk Hali Devam Edecek, Fırat Sarı Savunmasını Yaptı",
    imageUrl: "/default2.jpg",
  },
  {
    newsId: "3",
    title:
      "Cumhurbaşkanı Erdoğan, İstanbul'da 20 Bin Öğretmenin Atama Törenine Katıldı",
    imageUrl: "/default4.jpg",
  },
  {
    newsId: "4",
    title:
      "Uzayda İlk Türk Astronot: Ay Görevinde Tarihi Bir İlk Gerçekleştirildi",
    imageUrl: "/default6.webp",
  },
  {
    newsId: "5",
    title:
      "Teknoloji Devi Yeni Nesil Akıllı Telefonunu Tanıttı: Yapay Zeka ile Sınırlar Aşılıyor",
    imageUrl: "/default7.webp",
  },
];

const defaultNewsDetails: NewsDetailDto[] = [
  {
    newsId: "default-1",
    title:
      "Cumhurbaşkanı Erdoğan: İnsanlık Filistin ve Lübnan'daki Zulümlere Karşı Sessiz Kalmamalı",
    shortDescription:
      "Cumhurbaşkanı Erdoğan, 4. Uluslararası STK Fuarı’nda konuştu ve “Dünya yönetişimi yapı͏l͏arı, dış örgütler ve dünya b͏asını Filistin’de, Lübnan’da ve ͏başka birç͏ok yerde olan insan suçlarını yok͏ sayıyor. Cani ola͏yların or͏taya çıkmaması için İsrail’in yararına tam bir örtme uygula͏nıyor” dedi.\r\n\r\nCumhurbaşkanı Recep Tayyip Erdoğan, ͏İslam Dünyas͏ı Sivil To͏plum Kuruluş͏ları Birliği ͏ile ͏Türkiye Gönüllü Teşekküller͏ V͏akfı ͏tarafından Atatürk Hava͏limanın'da yap͏ılan ͏4.͏ Uluslararası ST͏K Fuarı'na katılıp bir konuşma yapmış. İşte haberin ayrıntıları:",
    content:
      "<p>Cumhurbaşkanı Erdoğan Filistin'e ilişkin yaptığı konuşmalarda, Filistinlilerin hâlâ işgal ve katliamla karşı karşıya olduğu bir ortamda dünyanın güvende olmasının mümkün olmadığını ifade etti. Türkiye'nin Filistin'e sahip çıkma ve kolaylaştırma arayışını sürdürdüğünü vurgulayan Cumhurbaşkanı Erdoğan, Türkiye'nin mazlumun yanında, zalimin karşısında yer alan bir ülke olduğunun altını çizdi. Ayrıca Lübnan'ın geleceğine ilişkin beklentilerini de dile getirmiş ve insan hakları ihlalleri sorununun altını çizmiştir. Bu açıklamalar, Türkiye'nin barış ve adaletin tesisi için uluslararası sahnedeki rolünü ve katkısını ortaya koymaktadır.</p>",
    keywords: ["Filistin", "işgal", "dünya güvenliği", "insan hakları"],
    publishedDate: new Date().toISOString(),
    imagePaths: ["/default1.jpg", "/default1.jpg"],
    categoryId: "Son Dakika",
  },
  {
    newsId: "default-2",
    title:
      "Yenidoğan Çetesi Davasında Ara Karar: Sanıkların Tutukluluk Hali Devam Edecek, Fırat Sarı Savunmasını Yaptı",
    shortDescription:
      "Yenidoğan Çetesi davasının 6. duruşmasında örgüt lideri Fırat Sarı savunmasını yaptı. Mahkeme, sanıkların tutukluluk hallerinin devamına karar verdi. Sarı'nın avukatı, müvekkilinin gelirinin giderinden fazla olmadığını belirtti. Duruşma, 26 Kasım'da devam edecek. Sarı, geçmişteki örgüt üyeliğinden ve hastane işletme sisteminden bahsederek suçlamalara yanıt verdi.",
    content:
      "<p>Yenidoğan Çetesi davasında, bebekleri ölüme sebebiyet verecek şekilde sevk eden ve haksız kazanç sağlayan sanıklardan Fırat Sarı, mahkemede savunmasını yaptı. Avukatı, Sarı'nın gelirinin giderinden düşük olduğunu belirterek, ailesinden maddi destek aldığını ifade etti. Sarı, geçmişteki örgüt üyeliği deneyimlerini anlatarak, özel hastanelerdeki işletme modelini açıkladı. Mahkeme sanıkların tutukluluk hallerinin devamına karar verdi ve duruşma 26 Kasım'a ertelendi.</p>",
    keywords: ["Yeni doğan", "çete", "bebek", "fırat sarı"],
    publishedDate: new Date().toISOString(),
    imagePaths: ["/default2.jpg", "/default3.webp"],
    categoryId: "Son Dakika",
  },
  {
    newsId: "default-3",
    title:
      "Cumhurbaşkanı Erdoğan, İstanbul'da 20 Bin Öğretmenin Atama Törenine Katıldı",
    shortDescription:
      "Cumhurbaşkanı Erdoğan, İstanbul'da düzenlenen Öğretmenler Günü ve atama programında 20 bin öğretmenin atamasında hazır bulundu. Yeni eğitim modelini tanıtan Erdoğan, eğitimde yaşanan değişimlere ve öğretmenlere düşen önemli sorumluluğa değindi. Ayrıca eğitim bütçesindeki artışa ve öğrenci kayıt seviyelerindeki yükselişe de vurgu yaptı. Erdoğan, 2002'den bu yana yapılan yatırım ve reformların Türkiye'nin eğitim alanındaki teknolojik başarılarını artırdığını söyledi.",
    content:
      "<p>Cumhurbaşkanı Erdoğan, İstanbul'daki Öğretmenler Günü ve atama törenine katıldı ve 20 bin öğretmenin atamasını gerçekleştirdi. Konuşmasında öğretmenlerin geleceği şekillendiren, milletin değerlerini geleceğe taşıyan önemli bir role sahip olduğunu belirtti. Eğitimdeki reformlardan, okullaşma oranlarının artmasından, öğretmen haklarının güçlendirilmesinden bahsederek, eğitimdeki başarıların sürdürülebilir olabilmesi için öğretmenlerin katkılarının devam edeceğini resmiyet kazandırdı</p>",
    keywords: ["Cumhurbaşkanı", "öğretmen", "eğitim bütçesi", "atama"],
    publishedDate: new Date().toISOString(),
    imagePaths: ["/default4.jpg", "/default5.webp"],
    categoryId: "Gündem",
  },
];

const defaultAstrologyNews: AstrologyNews[] = [
  {
    newsId: "1",
    title: "Bu Hafta Koç Burcunu Büyük Fırsatlar Bekliyor",
    publishedDate: new Date().toISOString(),
  },
  {
    newsId: "2",
    title: "Boğa Burcu İçin Aşk Kapıda: Yeni İlişkilere Hazır Olun",
    publishedDate: new Date().toISOString(),
  },
  {
    newsId: "3",
    title: "İkizler Burcunda Karar Anı: İş Hayatınızda Önemli Değişiklikler",
    publishedDate: new Date().toISOString(),
  },
  {
    newsId: "4",
    title:
      "Yengeç Burcuna Yıldızlardan Uyarı: Finansal Kararlarda Dikkatli Olun",
    publishedDate: new Date().toISOString(),
  },
  {
    newsId: "5",
    title: "Aslan Burcu Bu Ay Parlıyor: Yaratıcılığınızı Gösterme Zamanı",
    publishedDate: new Date().toISOString(),
  },
];

const defaultBreakingNews: BreakingNews[] = [
  {
    newsId: "1",
    title: "İstanbul'da Şiddetli Yağış: Ulaşımda Aksamalar Yaşanıyor",
  },
  {
    newsId: "2",
    title: "Dolar Kurunda Ani Yükseliş: Piyasalar Tedirgin",
  },
  {
    newsId: "3",
    title: "Futbol Dünyasında Şok: Ünlü Teknik Direktör Görevinden Ayrıldı",
  },
  {
    newsId: "4",
    title: "Avrupa Birliği Yeni Ekonomik Yaptırımları Duyurdu",
  },
  {
    newsId: "5",
    title:
      "Teknoloji Devi Yeni Ürünlerini Tanıttı: Global Piyasalar Hareketlendi",
  },
];
