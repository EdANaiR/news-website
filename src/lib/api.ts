const baseUrl = "https://newsapi-nxxa.onrender.com";

// Cache için yardımcı fonksiyon
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
        next: { revalidate: 300 }, // 5 dakika cache
      }
    );

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      ...item,
      imagePath: `${baseUrl}${item.imagePath}`,
    }));
  } catch (error) {
    console.error("There was a problem fetching the news:", error);
    return [];
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

    // Görselleri doğru şekilde ekle
    newsData.images.forEach((image, index) => {
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
    console.log("API Success Response:", result);
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
  try {
    const response = await fetch(`${baseUrl}/api/News/carousel`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const carouselItems = data?.$values ?? data;

    if (Array.isArray(carouselItems) && carouselItems.length > 0) {
      return carouselItems.map((item: any) => ({
        newsId: item.newsId.toString(),
        title: item.title,
        imageUrl: `${baseUrl}${item.imageUrl}`,
      }));
    }

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
    const response = await fetch(`${baseUrl}/api/news/${newsId}`, {
      cache: "no-store",
    });
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
