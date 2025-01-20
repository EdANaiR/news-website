"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Facebook, Share2 } from "lucide-react";
import {
  NewsDetailDto,
  NewsSummaryDto,
  getNewsByCategory,
  getNewsDetail,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

interface NewsDetailProps {
  initialData: NewsDetailDto | NewsSummaryDto[];
  categoryId?: string;
}

const defaultRelatedNews: NewsSummaryDto[] = [
  {
    newsId: "gundem-1",
    title: "Cumhurbaşkanı Erdoğan, Yeni Yatırım Projesini Açıkladı",
    imagePath: "/default23.webp",
    publishedDate: new Date().toISOString(),
    shortDescription:
      "Cumhurbaşkanı Erdoğan, Türkiye'deki istihdamı artırmayı amaçlayan yeni yatırım projelerini duyurdu.",
  },
  {
    newsId: "gundem-2",
    title: "Türkiye'nin En Büyük Havaalanı İçin Çalışmalar Başladı",
    imagePath: "/default24.jpg",
    publishedDate: new Date().toISOString(),
    shortDescription:
      "Yeni havaalanı projesi, Türkiye'nin ulaşım altyapısındaki büyük dönüşüm için önemli bir adım.",
  },
  {
    newsId: "gundem-3",
    title: "İstanbul'da Yeni Deprem Tatbikatı Yapıldı",
    imagePath: "/default25.jpg",
    publishedDate: new Date().toISOString(),
    shortDescription:
      "İstanbul'da olası bir deprem felaketi için büyük çapta bir tatbikat gerçekleştirildi.",
  },
  {
    newsId: "gundem-4",
    title: "Yeni Eğitim Yılı İçin Bakanlık'tan Önemli Açıklama",
    imagePath: "/default26.jpg",
    publishedDate: new Date().toISOString(),
    shortDescription:
      "Milli Eğitim Bakanlığı, yeni eğitim yılının başında alınacak önlemleri duyurdu.",
  },
  {
    newsId: "gundem-5",
    title: "Bakanlık, Çiftçilere Yeni Destek Paketini Açıkladı",
    imagePath: "/default27.jpg",
    publishedDate: new Date().toISOString(),
    shortDescription:
      "Tarım ve Orman Bakanlığı, çiftçilere yönelik yeni destek paketini duyurdu.",
  },
];

export default function NewsDetail({
  initialData,
  categoryId,
}: NewsDetailProps) {
  const [newsItems, setNewsItems] = useState<
    (NewsDetailDto | NewsSummaryDto)[]
  >(Array.isArray(initialData) ? initialData : [initialData]);
  const [relatedNews, setRelatedNews] =
    useState<NewsSummaryDto[]>(defaultRelatedNews);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadRelatedNews = useCallback(async () => {
    if (!categoryId) return;
    try {
      const related = await getNewsByCategory(categoryId);
      if (related && related.length > 0) {
        setRelatedNews(related.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading related news:", error);
      // Hata durumunda varsayılan haberleri kullanmaya devam et
    }
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
        const newItems = Array.isArray(initialData)
          ? nextNews
          : await Promise.all(
              nextNews.map((news) => getNewsDetail(news.newsId))
            );

        const uniqueNewItems = newItems.filter(
          (item): item is NewsDetailDto | NewsSummaryDto =>
            item !== null &&
            !newsItems.some(
              (existingItem) => existingItem.newsId === item.newsId
            )
        );

        if (uniqueNewItems.length > 0) {
          setNewsItems((prev) => [...prev, ...uniqueNewItems]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more news:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, categoryId, page, initialData, newsItems]);

  useEffect(() => {
    if (inView) {
      loadMoreNews();
    }
  }, [inView, loadMoreNews]);

  const getImageSrc = (imagePath: string) => {
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    } else if (imagePath.startsWith("/")) {
      return imagePath;
    } else {
      return `https://newsapi-nxxa.onrender.com${imagePath}`;
    }
  };

  const renderNewsItem = useCallback(
    (item: NewsDetailDto | NewsSummaryDto, index: number) => (
      <div key={`${item.newsId}-${index}`} className="mb-12">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary">
            Haberler
          </Link>
          {" › "}
          <span>{"Gündem"}</span>
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
              className="bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Button>
          </div>
        </div>

        {"imagePaths" in item &&
          item.imagePaths &&
          item.imagePaths.length > 0 && (
            <div className="relative w-full aspect-video mb-6">
              <Image
                src={getImageSrc(item.imagePaths[0])}
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
              src={getImageSrc(item.imagePath)}
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

        {"imagePaths" in item &&
          item.imagePaths &&
          item.imagePaths.length > 1 && (
            <div className="space-y-6 mb-6">
              {item.imagePaths.slice(1).map((imagePath, imgIndex) => (
                <div key={imgIndex} className="relative w-full aspect-video">
                  <Image
                    src={getImageSrc(imagePath)}
                    alt={`${item.title} - Image ${imgIndex + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

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
                  className="py-1 px-2 bg-muted text-sm rounded"
                >
                  <span className="text-red-600"></span>
                  {keyword}
                </div>
              ))}
            </div>
          </>
        )}

        {index < newsItems.length - 1 && (
          <div className="w-full h-24 bg-muted my-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Reklam Alanı</p>
          </div>
        )}
      </div>
    ),
    [newsItems.length]
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
          {newsItems.map((item, index) => renderNewsItem(item, index))}

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
                  href={`/news/${news.newsId}/${slugify(news.title)}`}
                  key={news.newsId}
                  className="block group space-y-3"
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={getImageSrc(news.imagePath)}
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
