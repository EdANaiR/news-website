"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Facebook, Twitter, Share2 } from "lucide-react";
import {
  NewsDetailDto,
  NewsSummaryDto,
  getNewsByCategory,
  getNewsDetail,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NewsDetailProps {
  initialData: NewsDetailDto | NewsSummaryDto[];
  categoryId?: string;
}

export default function NewsDetail({
  initialData,
  categoryId,
}: NewsDetailProps) {
  const [newsDetails, setNewsDetails] = useState<NewsDetailDto[]>(
    Array.isArray(initialData) ? [] : [initialData as NewsDetailDto]
  );
  const [newsSummaries, setNewsSummaries] = useState<NewsSummaryDto[]>(
    Array.isArray(initialData) ? initialData : []
  );
  const [relatedNews, setRelatedNews] = useState<NewsSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadRelatedNews = useCallback(async () => {
    if (!categoryId) return;
    const related = await getNewsByCategory(categoryId);
    setRelatedNews(related.slice(0, 5));
  }, [categoryId]);

  useEffect(() => {
    loadRelatedNews();
  }, [loadRelatedNews]);

  const loadMoreNews = useCallback(async () => {
    if (loading || !hasMore || !categoryId) return;

    setLoading(true);
    try {
      const nextNews = await getNewsByCategory(categoryId, page, 5);
      if (nextNews && nextNews.length > 0) {
        if (Array.isArray(initialData)) {
          setNewsSummaries((prev) => [...prev, ...nextNews]);
        } else {
          const newDetailsPromises = nextNews.map((news) =>
            getNewsDetail(news.newsId)
          );
          const newDetails = await Promise.all(newDetailsPromises);
          const uniqueNewDetails = newDetails.filter(
            (detail): detail is NewsDetailDto => detail !== null
          );
          setNewsDetails((prev) => [...prev, ...uniqueNewDetails]);
        }
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more news:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, categoryId, page, initialData]);

  useEffect(() => {
    if (inView) {
      loadMoreNews();
    }
  }, [inView, loadMoreNews]);

  const renderNewsItem = (
    item: NewsDetailDto | NewsSummaryDto,
    index: number
  ) => (
    <div key={item.newsId} className="mb-12">
      <div className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary">
          Haberler
        </Link>
        {" › "}
        <span>{categoryId || "Gündem"}</span>
      </div>

      <h1 className="text-4xl font-bold leading-tight mb-4">{item.title}</h1>
      <div className="flex items-center justify-between py-3 border-y border-muted mb-6">
        <div className="text-sm text-muted-foreground">
          {new Date(item.publishedDate).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#25d366] text-white hover:bg-[#25d366]/90"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1877f2] text-white hover:bg-[#1877f2]/90"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90"
          >
            <Twitter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {"imagePaths" in item &&
        item.imagePaths &&
        item.imagePaths.length > 0 && (
          <div className="relative w-full aspect-video mb-6">
            <Image
              src={`http://localhost:5142${item.imagePaths[0]}`}
              alt={item.title}
              fill
              className="object-cover rounded-lg"
              priority={index === 0}
            />
          </div>
        )}

      {"imagePath" in item && (
        <div className="relative w-full aspect-video mb-6">
          <Image
            src={`http://localhost:5142${item.imagePath}`}
            alt={item.title}
            fill
            className="object-cover rounded-lg"
            priority={index === 0}
          />
        </div>
      )}

      <p className="text-2xl font-medium leading-relaxed mb-6">
        {item.shortDescription}
      </p>

      {"content" in item && (
        <div
          className="text-lg prose max-w-none mb-6 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: item.content.replace(
              /<p>/g,
              '<p class="first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">'
            ),
          }}
        />
      )}

      {"keywords" in item && (
        <>
          <div className="text-gray-700">Etiketler</div>
          <div className="flex flex-wrap gap-2 mb-6">
            {item.keywords.map((keyword, keywordIndex) => (
              <div
                key={`${item.newsId}-${keyword}-${keywordIndex}`}
                className="py-1 bg-muted text-sm"
              >
                <span className="text-red-600">#</span>
                {keyword}
              </div>
            ))}
          </div>
        </>
      )}

      {index <
        (Array.isArray(initialData)
          ? newsSummaries.length
          : newsDetails.length) -
          1 && (
        <div className="w-full h-24 bg-muted my-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Reklam Alanı</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="w-full h-24 bg-muted mb-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Reklam Alanı</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-32 h-[600px] bg-muted flex-shrink-0">
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground rotate-90">
              Reklam Alanı
            </p>
          </div>
        </div>

        <div className="flex-grow">
          {Array.isArray(initialData)
            ? newsSummaries.map((item, index) => renderNewsItem(item, index))
            : newsDetails.map((item, index) => renderNewsItem(item, index))}

          <div ref={ref} className="h-10 flex items-center justify-center">
            {loading && <p>Daha fazla haber yükleniyor...</p>}
            {!hasMore && <p>Başka haber bulunmuyor.</p>}
          </div>
        </div>

        <div className="lg:w-64 space-y-6 flex-shrink-0">
          <Card className="w-full h-60 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Reklam Alanı</p>
          </Card>

          <Card>
            <div className="p-4 border-b">
              <h2 className="font-bold text-xl">İlgili Haberler</h2>
            </div>
            <div className="p-3 space-y-6">
              {relatedNews.map((news) => (
                <Link
                  href={`/news/${news.newsId}`}
                  key={news.newsId}
                  className="block group space-y-3"
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={`http://localhost:5142${news.imagePath}`}
                      alt={news.title}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <h3 className="text-lg font-medium leading-tight group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="hidden lg:block lg:w-32 h-[600px] bg-muted flex-shrink-0">
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground rotate-90">
              Reklam Alanı
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
