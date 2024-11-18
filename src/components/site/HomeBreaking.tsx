import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { BreakingNews, getBreakingNews } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeBreaking() {
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const news = await getBreakingNews();
        setBreakingNews(news);
        setIsLoading(false);
      } catch (err) {
        setError("Sondakika haberleri yüklenirken bir hata oluştu.");
        setIsLoading(false);
      }
    }

    fetchBreakingNews();
  }, []);

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="w-full max-w-xs border-2">
      <CardHeader className="text-black py-2 px-4 flex flex-row items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <CardTitle className="text-lg font-semibold">Son Dakika</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {breakingNews.map((news, index) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
