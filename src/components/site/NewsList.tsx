"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Category,
  NewsSummaryDto,
  getCategories,
  getNewsByCategory,
  getImageSrc,
} from "@/lib/api";
import { Clock } from "lucide-react";
import dynamic from "next/dynamic";

const Advertisement = dynamic(() => import("@/components/ui/Advertisement"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false,
});

interface CategoryWithNews {
  category: Category;
  news: NewsSummaryDto[];
}

export default function NewsList() {
  const [categoriesWithNews, setCategoriesWithNews] = useState<
    CategoryWithNews[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memory cache - client-side cache
  const cacheRef = useRef(new Map());

  const getCacheKey = (categoryId: string) => `news_${categoryId}`;

  const getCachedData = (categoryId: string) => {
    const key = getCacheKey(categoryId);
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      // 5 dakika cache
      return cached.data;
    }
    return null;
  };

  const setCachedData = (categoryId: string, data: NewsSummaryDto[]) => {
    const key = getCacheKey(categoryId);
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  };

  // Optimized news fetching with concurrent requests
  const fetchNewsForCategory = useCallback(
    async (category: Category): Promise<CategoryWithNews> => {
      try {
        // Önce cache'i kontrol et
        const cachedNews = getCachedData(category.categoryId);
        if (cachedNews) {
          return { category, news: cachedNews };
        }

        // Cache yoksa API'den çek
        const news = await getNewsByCategory(category.categoryId, 1, 6); // Sadece 6 haber çek
        setCachedData(category.categoryId, news);

        return { category, news };
      } catch (error) {
        console.error(
          `Error fetching news for category ${category.name}:`,
          error
        );
        return { category, news: [] };
      }
    },
    []
  );

  // Main data fetching function
  const fetchCategoriesAndNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // İlk önce kategorileri çek
      const categories = await getCategories();

      if (categories.length === 0) {
        setCategoriesWithNews([]);
        return;
      }

      // Tüm kategoriler için paralel olarak haber çek
      const newsPromises = categories.map((category) =>
        fetchNewsForCategory(category)
      );

      // İlk 3 kategoriyi öncelikle yükle (Above the fold)
      const priorityPromises = newsPromises.slice(0, 3);
      const remainingPromises = newsPromises.slice(3);

      // Öncelikli kategorileri yükle
      const priorityResults = await Promise.allSettled(priorityPromises);
      const priorityData = priorityResults
        .map((result, index) =>
          result.status === "fulfilled"
            ? result.value
            : { category: categories[index], news: [] }
        )
        .filter((item) => item.news.length > 0);

      // Hemen göster
      setCategoriesWithNews(priorityData);

      // Kalan kategorileri arka planda yükle
      if (remainingPromises.length > 0) {
        Promise.allSettled(remainingPromises).then((remainingResults) => {
          const remainingData = remainingResults
            .map((result, index) =>
              result.status === "fulfilled"
                ? result.value
                : { category: categories[index + 3], news: [] }
            )
            .filter((item) => item.news.length > 0);

          // Mevcut veriye ekle
          setCategoriesWithNews((prev) => [...prev, ...remainingData]);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Haber verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchNewsForCategory]);

  useEffect(() => {
    fetchCategoriesAndNews();
  }, [fetchCategoriesAndNews]);

  // Retry function
  const handleRetry = useCallback(() => {
    setCategoriesWithNews([]);
    fetchCategoriesAndNews();
  }, [fetchCategoriesAndNews]);

  // Loading skeleton component
  const LoadingSkeleton = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[16/9] rounded-t-lg" />
            <div className="p-4 bg-gray-100 rounded-b-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  if (isLoading && categoriesWithNews.length === 0) {
    return LoadingSkeleton;
  }

  if (error && categoriesWithNews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  if (categoriesWithNews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">
          Şu anda görüntülenecek haber bulunmuyor.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categoriesWithNews.map((item, index) => (
        <CategorySection
          key={item.category.categoryId}
          item={item}
          index={index}
          isLast={index === categoriesWithNews.length - 1}
        />
      ))}

      {/* Loading indicator for remaining categories */}
      {isLoading && categoriesWithNews.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
            Daha fazla kategori yükleniyor...
          </div>
        </div>
      )}
    </div>
  );
}

// Separated CategorySection component for better performance
const CategorySection = ({
  item,
  index,
  isLast,
}: {
  item: CategoryWithNews;
  index: number;
  isLast: boolean;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between py-3 border-b-2 border-red-600 mb-6">
        <h2 className="text-3xl font-bold">{item.category.name}</h2>
        <Link
          href={`/category/${item.category.categoryId}`}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          Tüm Haberler →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {item.news.slice(0, 6).map((newsItem, newsIndex) => (
          <NewsCard
            key={newsItem.newsId}
            newsItem={newsItem}
            priority={index === 0 && newsIndex === 0}
          />
        ))}
      </div>

      {!isLast && (
        <div className="mt-12">
          <Advertisement />
          <Separator className="my-8" />
        </div>
      )}
    </div>
  );
};

// Memoized NewsCard component
const NewsCard = ({
  newsItem,
  priority,
}: {
  newsItem: NewsSummaryDto;
  priority: boolean;
}) => {
  const [imgSrc, setImgSrc] = useState(getImageSrc(newsItem.imagePath));

  const handleImageError = useCallback(() => {
    setImgSrc("/placeholder.png");
  }, []);

  return (
    <Link href={`/news/${newsItem.newsId}`} passHref>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer border-none">
        <div className="aspect-[16/9] relative">
          <Image
            src={imgSrc}
            alt={newsItem.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onError={handleImageError}
          />
        </div>
        <CardContent className="p-4 bg-gray-100">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
            {newsItem.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {newsItem.shortDescription}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {new Date(newsItem.publishedDate).toLocaleString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
