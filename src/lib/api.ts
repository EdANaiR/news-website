const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://general-gabriella-edaprojects-53fb99e6.koyeb.app";

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

function getCacheKey(url: string): string {
  return `${url}`;
}

async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const cacheKey = getCacheKey(url);
  const cachedData = cache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // 404 durumunda boş array dön
  if (response.status === 404) {
    return [] as T;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

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
    const data = await fetchWithCache<Category[]>(`${baseUrl}/api/Categories`, {
      next: { revalidate: 300 }, // 5 dakika cache
    });
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch(`${baseUrl}/api/Categories/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

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
  keywords: string[];
}

export async function getNewsByCategory(
  categoryId: string,
  page = 1,
  pageSize = 10
): Promise<NewsSummaryDto[]> {
  try {
    const data = await fetchWithCache<NewsSummaryDto[]>(
      `${baseUrl}/api/News/category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!data || data.length === 0) {
      return [];
    }

    // API yanıtını kontrol etmek için log
    console.log("API Category News Response:", JSON.stringify(data, null, 2));

    return data.map((item) => ({
      ...item,
      // imagePath'i getImageSrc ile düzenliyoruz
      imagePath: getImageSrc(item.imagePath),
      // Keywords null ise boş array yap
      keywords:
        item.keywords && Array.isArray(item.keywords) ? item.keywords : [],
    }));
  } catch (error) {
    console.error("There was a problem fetching the news:", error);
    return [];
  }
}

export async function addCategory(category: AddCategoryDto): Promise<Category> {
  try {
    const response = await fetch(
      "https://general-gabriella-edaprojects-53fb99e6.koyeb.app/api/Categories",
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

    // Görsel yükleme işlemini kontrol etmek için log
    console.log("Yüklenen görseller:", newsData.images);

    newsData.images.forEach((image, index) => {
      console.log("Image being appended:", {
        name: image.name,
        type: image.type,
        size: image.size,
      });
      formData.append(`images`, image, image.name);
    });

    const response = await fetch(`${baseUrl}/api/News`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // API yanıtını kontrol etmek için log
    console.log("API Success Response:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error adding news:", error);
    throw error;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${baseUrl}/api/News`, {
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
      // Keywords null ise boş array yap
      keywords:
        item.keywords && Array.isArray(item.keywords) ? item.keywords : [],
      images:
        item.images?.map((image) => ({
          ...image,
          imagePath: `${baseUrl}${image.imagePath}`,
        })) || [],
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

// Görsel URL'sini oluşturan yardımcı fonksiyon - Cloudinary destekli
export function getImageSrc(imagePath: string) {
  if (!imagePath) return "/placeholder.jpg";

  // Debug için log
  console.log("Gelen imagePath:", imagePath);

  // Cloudinary URL'si ise direkt döndür
  if (
    imagePath.includes("cloudinary.com") ||
    imagePath.startsWith("http") ||
    imagePath.startsWith("https")
  ) {
    return imagePath;
  }

  // Eski backend URL'leri için fallback
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  console.log("Oluşturulan URL:", fullUrl);
  return fullUrl;
}

// Carousel haberlerini getir - fallback ile
export async function getCarouselNews(): Promise<CarouselNewsItem[]> {
  try {
    console.log(
      "🔄 Carousel news API'sine istek gönderiliyor:",
      `${baseUrl}/api/News/carousel`
    );

    const response = await fetch(`${baseUrl}/api/News/carousel`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    console.log("📡 API Response Status:", response.status);
    console.log("📡 API Response Status Text:", response.statusText);
    console.log(
      "📡 API Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      // Hata detaylarını almaya çalışalım
      let errorText = "";
      try {
        errorText = await response.text();
        console.error("❌ API Error Response Body:", errorText);
      } catch (e) {
        console.error("❌ Hata response body okunamadı:", e);
      }

      // Eğer carousel endpoint yoksa, fallback olarak normal news'den çekelim
      if (response.status === 404 || response.status === 500) {
        console.warn(
          "⚠️ Carousel endpoint bulunamadı, fallback'e geçiliyor..."
        );
        return await getCarouselNewsFallback();
      }

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("✅ API Response Data:", JSON.stringify(data, null, 2));

    const carouselItems = data?.$values ?? data;

    if (Array.isArray(carouselItems) && carouselItems.length > 0) {
      const processedItems = carouselItems.map((item: any) => ({
        newsId: item.newsId.toString(),
        title: item.title,
        imageUrl: getImageSrc(item.imageUrl),
      }));

      console.log("✅ Processed carousel items:", processedItems);
      return processedItems;
    }

    console.warn("⚠️ Carousel data boş veya geçersiz:", carouselItems);
    // Fallback'e geç
    return await getCarouselNewsFallback();
  } catch (error) {
    console.error("❌ Error fetching carousel news:", error);
    // Son çare olarak fallback dene
    try {
      console.log("🔄 Fallback carousel news deneniyor...");
      return await getCarouselNewsFallback();
    } catch (fallbackError) {
      console.error("❌ Fallback de başarısız oldu:", fallbackError);
      throw error; // Orijinal hatayı fırlat
    }
  }
}

// Fallback carousel news fonksiyonu
async function getCarouselNewsFallback(): Promise<CarouselNewsItem[]> {
  try {
    console.log(
      "🔄 Fallback: Normal news API'den carousel verisi çekiliyor..."
    );

    // Normal news endpoint'ini dene
    const response = await fetch(`${baseUrl}/api/News`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fallback failed! status: ${response.status}`);
    }

    const data = await response.json();
    const newsItems = data?.$values ?? data;

    if (Array.isArray(newsItems) && newsItems.length > 0) {
      // İlk 5 haberi carousel için kullan
      const carouselItems = newsItems.slice(0, 5).map((item: any) => ({
        newsId: item.newsId?.toString() || item.id?.toString(),
        title: item.title,
        imageUrl: getImageSrc(
          item.imagePath || item.images?.[0]?.imagePath || ""
        ),
      }));

      console.log("✅ Fallback carousel items oluşturuldu:", carouselItems);
      return carouselItems;
    }

    throw new Error("Fallback'te de veri bulunamadı");
  } catch (error) {
    console.error("❌ Fallback carousel news hatası:", error);
    throw error;
  }
}

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
    console.log(
      "🔄 News detail API'sine istek gönderiliyor:",
      `${baseUrl}/api/news/${newsId}`
    );

    const response = await fetch(`${baseUrl}/api/news/${newsId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📡 News Detail API Response Status:", response.status);
    console.log(
      "📡 News Detail API Response Status Text:",
      response.statusText
    );
    console.log(
      "📡 News Detail API Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      // Hata detaylarını almaya çalışalım
      let errorText = "";
      try {
        errorText = await response.text();
        console.error("❌ News Detail API Error Response Body:", errorText);
      } catch (e) {
        console.error("❌ News Detail hata response body okunamadı:", e);
      }

      if (response.status === 404) {
        console.warn("⚠️ News detail bulunamadı (404), null dönülüyor");
        return null;
      }

      throw new Error(
        `Failed to fetch news detail: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(
      "✅ News Detail API Response Data:",
      JSON.stringify(data, null, 2)
    );

    const processedData = {
      ...data,
      imagePaths:
        data.imagePaths?.map((path: string) => getImageSrc(path)) || [],
      // Keywords null ise boş array yap
      keywords:
        data.keywords && Array.isArray(data.keywords) ? data.keywords : [],
    } as NewsDetailDto;

    console.log("✅ Processed News Detail:", processedData);
    return processedData;
  } catch (error) {
    console.error("❌ Error fetching news detail:", error);
    throw error;
  }
}

export interface AstrologyNews {
  newsId: string;
  title: string;
  publishedDate: string;
}

export async function getAstrologyNews(): Promise<AstrologyNews[]> {
  try {
    const response = await fetch(`${baseUrl}/api/News/astroloji-news`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch astrology news");
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid astrology news data format");
    }
    return data;
  } catch (error) {
    console.error("Error fetching astrology news:", error);
    throw error;
  }
}

export async function getAstrologyNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `${baseUrl}/api/News/astroloji-news/${newsId}`,
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
    throw error;
  }
}

export interface BreakingNews {
  newsId: string;
  title: string;
}

export async function getBreakingNews(): Promise<BreakingNews[]> {
  try {
    const response = await fetch(`${baseUrl}/api/News/breaking-news`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch breaking news");
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid breaking news data format");
    }
    return data;
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    throw error;
  }
}

export async function getBreakingNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `${baseUrl}/api/News/breaking-news/${newsId}`,
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
    throw error;
  }
}
