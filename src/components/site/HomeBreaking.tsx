"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { BreakingNews, getBreakingNews } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeBreaking() {
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const news = await getBreakingNews();
        setBreakingNews(news);
      } catch (err) {
        console.error("Error fetching breaking news:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBreakingNews();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs border-2">
        <CardHeader className="text-black py-2 px-4 flex flex-row items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg font-semibold">Son Dakika</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div>Yükleniyor...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xs border-2">
      <CardHeader className="text-black py-2 px-4 flex flex-row items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <CardTitle className="text-lg font-semibold">Son Dakika</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {breakingNews.length > 0 ? (
          breakingNews.map((news) => (
            <Link href={`/news/${news.newsId}`} key={news.newsId}>
              <div className="flex items-start gap-2 border-b border-gray-200 p-3 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                <Badge variant="destructive" className="mt-1 shrink-0">
                  Yeni
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{news.title}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Son dakika haberi bulunamadı.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
