"use client";

import { useState, useEffect } from "react";
import { getNews, NewsItem } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Pencil } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        const data = await getNews();
        if (mounted) {
          setNews(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching news:", err);
          setError("Haberler yüklenirken bir hata oluştu.");
          setIsLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = (newsId: string) => {
    console.log("Editing news with ID:", newsId);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Tarih belirtilmemiş";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: tr });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Geçersiz tarih";
    }
  };

  const SkeletonCard = ({ index }: { index: number }) => (
    <Card key={`skeleton-${index}`} className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{item.title || "Başlık yok"}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(item.newsId)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Düzenle</span>
          </Button>
        </div>
        <CardDescription>{formatDate(item.publishedDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {item.shortDescription || "Açıklama yok"}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.keywords?.length > 0 ? (
            item.keywords.map((keyword: string, index: number) => (
              <Badge
                key={`${item.newsId}-keyword-${index}`}
                variant="secondary"
              >
                {keyword}
              </Badge>
            ))
          ) : (
            <Badge key={`${item.newsId}-no-keywords`} variant="secondary">
              Anahtar kelime yok
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="outline">Devamını Oku</Button>
      </CardFooter>
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Haberler</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Haberler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} index={index} />
            ))
          : news.map((item) => <NewsCard key={item.newsId} item={item} />)}
      </div>
    </div>
  );
}
