// Types matching the C# models

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
    const response = await fetch("http://localhost:5142/api/Categories", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category[] = await response.json();
    return data; // Doğrudan API'den gelen array'i döndürüyoruz
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch("http://localhost:7045/api/Categories${id}", {
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
  page: number = 1,
  pageSize: number = 10
): Promise<NewsSummaryDto[]> {
  try {
    const response = await fetch(
      `http://localhost:5142/api/News/category/${categoryId}?page=${page}&pageSize=${pageSize}`
    );

    if (response.status === 404) {
      console.warn(`No news found for category ${categoryId}`);
      return [];
    }

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data: NewsSummaryDto[] = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem fetching the news:", error);
    return [];
  }
}

export async function addCategory(category: AddCategoryDto): Promise<Category> {
  try {
    const response = await fetch("http://localhost:7045/api/Categories", {
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
  keywords: string;
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
    formData.append("keywords", newsData.keywords);
    formData.append("publishedDate", newsData.publishedDate);
    formData.append("categoryId", newsData.categoryId);

    newsData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const response = await fetch("http://localhost:7045/api/News", {
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
    const response = await fetch("http://localhost:7045/api/News", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data.$values;
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
    const response = await fetch(`http://localhost:5142/api/News/carousel`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const carouselItems = data?.$values ?? data;

    if (Array.isArray(carouselItems)) {
      return carouselItems.map((item: any) => ({
        newsId: item.newsId,
        title: item.title,
        imageUrl: item.imageUrl,
      }));
    }

    console.warn("Unexpected data structure for carousel news:", data);
    return [];
  } catch (error) {
    console.error("Error fetching carousel news:", error);
    return [];
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
    const response = await fetch(`http://localhost:5142/api/news/${newsId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch news detail: ${response.statusText}`);
    }
    const data = await response.json();
    return data as NewsDetailDto;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}

export interface AstrologyNews {
  newsId: string;
  title: string;
  publishedDate: string;
}

export async function getAstrologyNews(): Promise<AstrologyNews[]> {
  const response = await fetch("http://localhost:5142/api/News/astroloji-news");
  if (!response.ok) {
    throw new Error("Failed to fetch astrology news");
  }
  return response.json();
}

export async function getAstrologyNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `http://localhost:5142/api/News/astroloji-news/${newsId}`,
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
  const response = await fetch("http://localhost:5142/api/News/breaking-news");
  if (!response.ok) {
    throw new Error("Failed to fetch astrology news");
  }
  return response.json();
}

export async function getBreakingNewsDetail(
  newsId: string
): Promise<NewsDetailDto | null> {
  try {
    const response = await fetch(
      `http://localhost:5142/api/News/breaking-news/${newsId}`,
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
