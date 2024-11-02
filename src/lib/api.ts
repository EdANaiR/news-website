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

interface CategoryResponse {
  $id: string;
  $values: Category[];
}

export interface CarouselNewsItem {
  id: string;
  title: string;
  imageUrl: string;
  publishDate: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("https://localhost:7045/api/Categories", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryResponse = await response.json();
    return data.$values; // Doğrudan $values array'ini döndürüyoruz
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch("https://localhost:7045/api/Categories${id}", {
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

export async function addCategory(category: AddCategoryDto): Promise<Category> {
  try {
    const response = await fetch("https://localhost:7045/api/Categories", {
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

export async function getCarouselNews(): Promise<CarouselNewsItem[]> {
  try {
    const response = await fetch("https://localhost:7045/api/Carousel");
    if (!response.ok) {
      throw new Error("Failed to fetch carousel news");
    }
    const data = await response.json();
    // API'den gelen veriyi doğru formata dönüştürün
    return Array.isArray(data) ? data : data.$values || [];
  } catch (error) {
    console.error("Error fetching carousel news:", error);
    // Hata durumunda boş bir dizi döndürün
    return [];
  }
}

export async function uploadCarouselNews(
  newsItem: Omit<CarouselNewsItem, "id" | "imageUrl"> & { image: File }
): Promise<CarouselNewsItem> {
  const formData = new FormData();

  formData.append("title", newsItem.title);
  formData.append("publishDate", newsItem.publishDate);
  formData.append("image", newsItem.image);

  try {
    const response = await fetch("https://localhost:7045/api/Carousel", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `Failed to upload news item: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in uploadCarouselNews:", error);
    throw error;
  }
}

export interface NewsItem {
  newsId: string;
  title: string;
  shortDescription: string;
  content: string;
  keywords: {
    $id: string;
    $values: string[];
  };
  publishedDate?: string;
  imageUrls: string[];
  categoryId: string;
}

interface NewsResponse {
  $id: string;
  $values: NewsItem[];
}

export async function addNews(newsData: NewsItem): Promise<NewsItem> {
  try {
    const response = await fetch("https://localhost:7045/api/News", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsData),
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
    const response = await fetch("https://localhost:7045/api/News", {
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
