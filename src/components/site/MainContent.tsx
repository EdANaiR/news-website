"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  getCategories,
  getCarouselNews,
  Category,
  CarouselNewsItem,
} from "@/lib/api";

const fallbackCategories: Category[] = [
  { categoryId: "1", name: "Gündem", newsArticles: null },
  { categoryId: "2", name: "Ekonomi", newsArticles: null },
  { categoryId: "3", name: "Spor", newsArticles: null },
  { categoryId: "4", name: "Teknoloji", newsArticles: null },
];

export const MainContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [carouselNews, setCarouselNews] = useState<CarouselNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalSlides = 14;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedCategories, fetchedNews] = await Promise.all([
          getCategories(),
          getCarouselNews(),
        ]);
        setCategories(fetchedCategories);
        setCarouselNews(fetchedNews);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (isLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
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
        {/* Left Advertisement */}
        <div className="hidden lg:block w-[160px] h-[600px] bg-gray-200">
          <img
            src="/placeholder.svg?height=600&width=160&text=Ad"
            alt="Left Advertisement"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Main Carousel */}
          {carouselNews.length > 0 ? (
            <div className="relative mb-8">
              <div className="overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselNews.map((news, index) => (
                    <div key={news.id} className="w-full flex-shrink-0">
                      <Card className="relative">
                        <CardContent className="p-0">
                          <img
                            src={
                              news.imageUrl ||
                              `/placeholder.svg?height=400&width=800&text=Haber+${
                                index + 1
                              }`
                            }
                            alt={news.title}
                            className="w-full h-[400px] object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-[#ff0000ee] text-white p-4">
                            <h2 className="text-xl font-bold">{news.title}</h2>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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

              <div className="flex justify-center gap-2 mt-4">
                {carouselNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-8 h-8 rounded ${
                      currentSlide === index
                        ? "bg-[#ff0000ee] text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              Carousel haberleri yüklenemedi.
            </div>
          )}

          {/* Thumbnail News Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={`/placeholder.svg?height=150&width=300&text=Haber`}
                    alt={`Küçük Haber ${index + 1}`}
                    className="w-full h-[150px] object-cover"
                  />
                  <div className="bg-[#ff0000ee] text-white p-2">
                    <h3 className="text-sm font-bold">
                      Alt Haber Başlığı {index + 1}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Sections */}
          {categories.map((category, index) => (
            <div key={category.categoryId}>
              <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[...Array(6)].map((_, newsIndex) => (
                  <Card key={newsIndex} className="overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=200&width=300&text=${category.name}`}
                      alt={`${category.name} Haber`}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <CardTitle className="mb-2 text-lg">
                        {category.name} Haberi {newsIndex + 1}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Inter-category Advertisement */}
              {index < categories.length - 1 && (
                <div className="my-8 bg-gray-200 p-4 text-center">
                  <p className="text-gray-500">
                    Reklam Alanı - Kategori Arası (728x90)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block space-y-8 w-[300px]">
          {/* Right Advertisement */}
          <div className="bg-gray-200 p-4 text-center h-[600px]">
            <p className="text-gray-500">Reklam Alanı - Skyscraper (300x600)</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Son Dakika</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <li key={index} className="flex items-center">
                    <Badge
                      variant="destructive"
                      className="mr-2 bg-[#ff0000ee]"
                    >
                      Yeni
                    </Badge>
                    <span className="text-sm">
                      Son dakika haberi {index + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Piyasalar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  ["Dolar", "8.45 ₺"],
                  ["Euro", "10.20 ₺"],
                  ["Altın", "505.00 ₺"],
                  ["Bitcoin", "$45,000"],
                ].map(([currency, value]) => (
                  <li key={currency} className="flex justify-between">
                    <span>{currency}</span>
                    <span className="font-bold">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};
