"use client";

import { useEffect, useState, useMemo } from "react";
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

export default function NewsList() {
  const [categoriesWithNews, setCategoriesWithNews] = useState<
    {
      category: Category;
      news: NewsSummaryDto[];
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoriesAndNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const categories = await getCategories();

        const results = await Promise.all(
          categories.map(async (category) => {
            try {
              const news = await getNewsByCategory(category.categoryId);
              return { category, news };
            } catch (error) {
              console.error(
                `Error fetching news for category ${category.name}:`,
                error
              );
              return { category, news: [] };
            }
          })
        );

        if (isMounted) {
          const categoriesWithNewsFiltered = results.filter(
            (item) => item.news.length > 0
          );
          setCategoriesWithNews(categoriesWithNewsFiltered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError(
            "Haber verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategoriesAndNews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
        <div key={item.category.categoryId}>
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
              <Link
                key={newsItem.newsId}
                href={`/news/${newsItem.newsId}`}
                passHref
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer border-none">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={getImageSrc(newsItem.imagePath)}
                      alt={newsItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      priority={index === 0 && newsIndex === 0}
                      loading={
                        index === 0 && newsIndex === 0 ? "eager" : "lazy"
                      }
                      // Hata durumunda yedek görsel gösterme
                      onError={(e: any) => {
                        e.target.src = "/placeholder.png"; // varsayılan bir görsel
                      }}
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
                        {new Date(newsItem.publishedDate).toLocaleString(
                          "tr-TR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {index < categoriesWithNews.length - 1 && (
            <div className="mt-12">
              <Advertisement />
              <Separator className="my-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
