const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://general-gabriella-edaprojects-53fb99e6.koyeb.app";

// Memory-based cache instead of localStorage (SSR safe)
const memoryCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

function getCacheKey(url: string): string {
  return `${url}`;
}

// Optimized fetch with better error handling
async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  useCache: boolean = true
): Promise<T> {
  const cacheKey = getCacheKey(url);

  if (useCache) {
    const cachedData = memoryCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }

  // AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // 404 durumunda boş array dön
    if (response.status === 404) {
      return [] as T;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (useCache) {
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

export interface AddCategoryDto {
  name: string;
}

export interface Category {
  categoryId: string;
  name: string;
  newsArticles: any | null;
}

// Optimized categories fetch
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchWithCache<Category[]>(`${baseUrl}/api/Categories`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Fallback to empty array instead of throwing
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const data = await fetchWithCache<Category>(
      `${baseUrl}/api/Categories/${id}`
    );
    return data;
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

// Heavily optimized getNewsByCategory
export async function getNewsByCategory(
  categoryId: string,
  page = 1,
  pageSize = 10,
  signal?: AbortSignal
): Promise<NewsSummaryDto[]> {
  // Early validation
  if (!categoryId || typeof categoryId !== "string") {
    console.error("Invalid categoryId:", categoryId);
    return [];
  }

  try {
    const url = `${baseUrl}/api/News/category/${categoryId}?page=${page}&pageSize=${pageSize}`;

    const options: RequestInit = {};
    if (signal) {
      options.signal = signal;
    }

    const data = await fetchWithCache<NewsSummaryDto[]>(url, options);

    if (!Array.isArray(data)) {
      console.warn(`Invalid data format for category ${categoryId}:`, data);
      return [];
    }

    if (data.length === 0) {
      return [];
    }

    // Process data with optimized image handling
    const processedData = data.map((item) => ({
      ...item,
      imagePath: getImageSrc(item.imagePath),
      keywords: Array.isArray(item.keywords) ? item.keywords : [],
    }));

    return processedData;
  } catch (error) {
    console.error(`Error fetching news for category ${categoryId}:`, error);
    return []; // Return empty array instead of throwing
  }
}

export async function addCategory(category: AddCategoryDto): Promise<Category> {
  try {
    const response = await fetch(`${baseUrl}/api/Categories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

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
    console.log("🔄 AddNews API'sine istek gönderiliyor...");
    console.log("📊 News Data:", {
      title: newsData.title,
      shortDescription: newsData.shortDescription,
      content: newsData.content,
      keywords: newsData.keywords,
      publishedDate: newsData.publishedDate,
      categoryId: newsData.categoryId,
      imagesCount: newsData.images.length,
    });

    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("shortDescription", newsData.shortDescription);
    formData.append("content", newsData.content);
    const keywordsString = newsData.keywords.join(", ");
    formData.append("keywords", keywordsString);
    formData.append("publishedDate", newsData.publishedDate);
    formData.append("categoryId", newsData.categoryId);

    console.log("📸 Yüklenen görseller:", newsData.images);

    if (newsData.images.length === 0) {
      console.warn("⚠️ Hiç görsel seçilmemiş!");
    }

    newsData.images.forEach((image, index) => {
      console.log(`📸 Image ${index + 1}:`, {
        name: image.name,
        type: image.type,
        size: image.size,
        lastModified: image.lastModified,
      });
      formData.append(`images`, image, image.name);
    });

    console.log("📋 FormData keys:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    console.log("🌐 API endpoint:", `${baseUrl}/api/News`);

    const response = await fetch(`${baseUrl}/api/News`, {
      method: "POST",
      body: formData,
    });

    console.log("📡 API Response Status:", response.status);
    console.log("📡 API Response Status Text:", response.statusText);
    console.log(
      "📡 API Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response Body:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ API Success Response:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("❌ Error adding news:", error);
    throw error;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const data = await fetchWithCache<NewsResponse>(`${baseUrl}/api/News`);

    const newsItems = data?.$values || data;

    if (!Array.isArray(newsItems)) {
      return [];
    }

    return newsItems.map((item) => ({
      ...item,
      keywords: Array.isArray(item.keywords) ? item.keywords : [],
      images:
        item.images?.map((image) => ({
          ...image,
          imagePath: `${baseUrl}${image.imagePath}`,
        })) || [],
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export interface CarouselNewsItem {
  newsId: string;
  title: string;
  imageUrl: string;
}

// Optimized image source function with fallback chain
export function getImageSrc(imagePath: string): string {
  if (!imagePath || typeof imagePath !== "string") {
    return "/placeholder.jpg";
  }

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

// Optimized carousel news with timeout and fallback
export async function getCarouselNews(): Promise<CarouselNewsItem[]> {
  try {
    console.log(
      "🔄 Carousel news API'sine istek gönderiliyor:",
      `${baseUrl}/api/News/carousel`
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

    const response = await fetch(`${baseUrl}/api/News/carousel`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    console.log("📡 API Response Status:", response.status);
    console.log("📡 API Response Status Text:", response.statusText);
    console.log(
      "📡 API Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
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
        newsId: item.newsId?.toString() || "",
        title: item.title || "",
        imageUrl: getImageSrc(item.imageUrl || item.imagePath || ""),
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
      return []; // Empty array instead of throwing
    }
  }
}

// Optimized fallback function
async function getCarouselNewsFallback(): Promise<CarouselNewsItem[]> {
  try {
    console.log(
      "🔄 Fallback: Normal news API'den carousel verisi çekiliyor..."
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Normal news endpoint'ini dene
    const response = await fetch(`${baseUrl}/api/News?pageSize=5`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Fallback failed! status: ${response.status}`);
    }

    const data = await response.json();
    const newsItems = data?.$values ?? data;

    if (Array.isArray(newsItems) && newsItems.length > 0) {
      // İlk 5 haberi carousel için kullan
      const carouselItems = newsItems.slice(0, 5).map((item: any) => ({
        newsId: item.newsId?.toString() || item.id?.toString() || "",
        title: item.title || "",
        imageUrl: getImageSrc(
          item.imagePath || item.images?.[0]?.imagePath || ""
        ),
      }));

      console.log("✅ Fallback carousel items oluşturuldu:", carouselItems);
      return carouselItems;
    }

    return [];
  } catch (error) {
    console.error("❌ Fallback carousel news hatası:", error);
    return [];
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
    if (!newsId) {
      console.error("News ID is required");
      return null;
    }

    console.log(
      "🔄 News detail API'sine istek gönderiliyor:",
      `${baseUrl}/api/news/${newsId}`
    );

    const data = await fetchWithCache<NewsDetailDto>(
      `${baseUrl}/api/news/${newsId}`,
      { cache: "no-store" },
      false // Don't use cache for news details
    );

    if (!data) {
      return null;
    }

    console.log(
      "✅ News Detail API Response Data:",
      JSON.stringify(data, null, 2)
    );

    const processedData = {
      ...data,
      imagePaths:
        data.imagePaths?.map((path: string) => getImageSrc(path)) || [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
    };

    console.log("✅ Processed News Detail:", processedData);
    return processedData;
  } catch (error) {
    console.error("❌ Error fetching news detail:", error);
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("404")
    ) {
      console.warn("⚠️ News detail bulunamadı (404), null dönülüyor");
      return null;
    }
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
    const data = await fetchWithCache<AstrologyNews[]>(
      `${baseUrl}/api/News/astroloji-news`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching astrology news:", error);
    return [];
  }
}

export async function getAstrologyNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    if (!newsId) return null;

    const data = await fetchWithCache<NewsDetailDto>(
      `${baseUrl}/api/News/astroloji-news/${newsId}`,
      { cache: "no-store" },
      false
    );

    return data || null;
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
    const data = await fetchWithCache<BreakingNews[]>(
      `${baseUrl}/api/News/breaking-news`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return [];
  }
}

export async function getBreakingNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    if (!newsId) return null;

    const data = await fetchWithCache<BreakingNews>(
      `${baseUrl}/api/News/breaking-news/${newsId}`,
      { cache: "no-store" },
      false
    );

    return (data as NewsDetailDto) || null;
  } catch (error) {
    console.error("Error fetching breaking news detail:", error);
    return null;
  }
}
