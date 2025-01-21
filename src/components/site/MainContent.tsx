"use client";

import Image from "next/image";
import Link from "next/link";
import NewsList from "@/components/site/NewsList";
import HomeAstro from "@/components/site/HomeAstro";
import HomeBreak from "@/components/site/HomeBreaking";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCarouselNews, CarouselNewsItem } from "@/lib/api";
import { slugify } from "@/lib/utils";

const useCarouselNews = () => {
  const [carouselNews, setCarouselNews] = useState<CarouselNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCarouselNews = await getCarouselNews();
        setCarouselNews(fetchedCarouselNews);
      } catch (error) {
        console.error("Failed to fetch carousel news:", error);
        setError("Haberler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { carouselNews, isLoading, error };
};

export const MainContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { carouselNews, isLoading, error } = useCarouselNews();

  useEffect(() => {
    if (carouselNews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselNews]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselNews.length) % carouselNews.length
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-[400px] bg-gray-200 rounded-lg mb-8"></div>
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="w-full h-[120px] bg-blue-600 mb-8 rounded overflow-hidden">
        <img
          src="/placeholder.svg?height=120&width=1200&text=Advertisement"
          alt="Advertisement"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-4">
        {/* Sol Reklam */}
        <div className="hidden lg:block w-[160px] h-[600px] bg-gray-200">
          <img
            src="/placeholder.svg?height=600&width=160&text=Ad"
            alt="Left Advertisement"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          {/* Carousel */}
          {carouselNews.length > 0 && (
            <div className="relative mb-8">
              <div className="overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselNews.map((news, index) => (
                    <Link
                      href={`/news/${news.newsId}/${slugify(news.title)}`}
                      key={news.newsId}
                      className="w-full flex-shrink-0"
                    >
                      <Card className="relative">
                        <CardContent className="p-0">
                          <div className="relative w-full h-[400px]">
                            <Image
                              src={news.imageUrl}
                              alt={news.title}
                              fill
                              className="object-cover brightness-75"
                              priority={index === currentSlide}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `/api/placeholder?text=${encodeURIComponent(
                                  news.title
                                )}`;
                              }}
                            />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                              <h2 className="text-3xl font-bold leading-tight text-shadow-lg">
                                {news.title}
                              </h2>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <Button
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="flex justify-center gap-1 mt-4 overflow-x-auto py-2">
                {carouselNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`min-w-[32px] h-8 flex items-center justify-center text-sm font-medium rounded transition-colors
                      ${
                        currentSlide === index
                          ? "bg-[#ff0000ee] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <NewsList />
        </div>

        <div className="hidden lg:block space-y-8 w-[300px]">
          {/* Reklam Alanı */}
          <div className="bg-gray-200 p-4 text-center h-[600px]">
            <p className="text-gray-500">Reklam Alanı - Skyscraper (300x600)</p>
          </div>

          <HomeBreak />
          <HomeAstro />
        </div>
      </div>
    </main>
  );
};
