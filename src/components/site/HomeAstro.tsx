"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Star } from "lucide-react";
import { AstrologyNews, getAstrologyNews } from "@/lib/api";
import Link from "next/link";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomeAstro() {
  const [astrologyNews, setAstrologyNews] = useState<AstrologyNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAstrologyNews() {
      try {
        const news = await getAstrologyNews();
        setAstrologyNews(news);
        setIsLoading(false);
      } catch (err) {
        setError("Astroloji haberleri yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    }

    fetchAstrologyNews();
  }, []);

  const getIcon = (index: number) => {
    const icons = [
      <Sun className="h-4 w-4" key="sun" />,
      <Moon className="h-4 w-4" key="moon" />,
      <Star className="h-4 w-4" key="star" />,
    ];
    return icons[index % icons.length];
  };

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Astroloji Haberleri</h2>
        <Badge variant="secondary">Yeni</Badge>
      </div>
      <div className="space-y-2">
        {astrologyNews.map((news, index) => (
          <Link href={`/news/${news.newsId}`} key={news.newsId}>
            <Card className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="shrink-0">{getIcon(index)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{news.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(news.publishedDate)}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
