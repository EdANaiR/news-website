"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { Category, getCategories, addNews, AddNewsDto } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function AddNewsPage() {
  const [images, setImages] = useState<File[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError("Kategoriler yüklenirken bir hata oluştu.");
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Kategoriler yüklenirken bir hata oluştu.",
        });
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("📸 Image upload event triggered");
    console.log("📁 Selected files:", files);

    if (files) {
      const fileArray = Array.from(files);
      console.log(
        "📸 Files to upload:",
        fileArray.map((file, idx) => ({
          index: idx,
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        }))
      );

      setImages((prev) => {
        const newImages = [...prev, ...fileArray];
        console.log(
          "📸 Updated images state:",
          newImages.map((img, idx) => ({
            index: idx,
            name: img.name,
            type: img.type,
            size: img.size,
          }))
        );
        return newImages;
      });
    } else {
      console.warn("⚠️ No files selected");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();
      const newKeyword = keywordInput.trim().startsWith("#")
        ? keywordInput.trim()
        : `#${keywordInput.trim()}`;
      setKeywords((prev) => [...prev, newKeyword]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("🚀 Admin form submit başlatıldı...");
    console.log("📝 Form state:", {
      title,
      shortDescription,
      content,
      keywords,
      selectedCategory,
      date: date.toISOString(),
      imagesCount: images.length,
    });

    console.log(
      "📸 Selected images:",
      images.map((img, idx) => ({
        index: idx,
        name: img.name,
        type: img.type,
        size: img.size,
        lastModified: img.lastModified,
      }))
    );

    if (!selectedCategory) {
      console.error("❌ Kategori seçilmemiş!");
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen bir kategori seçin.",
      });
      return;
    }

    if (images.length === 0) {
      console.warn("⚠️ Hiç görsel seçilmemiş!");
    }

    const newsData: AddNewsDto = {
      title,
      shortDescription,
      content,
      keywords,
      publishedDate: date.toISOString(),
      categoryId: selectedCategory,
      images,
    };

    console.log("📦 API'ye gönderilecek data:", {
      ...newsData,
      images: newsData.images.map((img, idx) => ({
        index: idx,
        name: img.name,
        type: img.type,
        size: img.size,
      })),
    });

    try {
      setIsLoading(true);
      const result = await addNews(newsData);
      console.log("✅ Admin form: Haber başarıyla eklendi:", result);

      toast({
        title: "Başarılı",
        description: "Haber başarıyla eklendi.",
      });

      setTitle("");
      setShortDescription("");
      setContent("");
      setKeywords([]);
      setImages([]);
      setSelectedCategory("");
      setDate(new Date());
    } catch (error) {
      console.error("❌ Admin form: Haber ekleme hatası:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Haber eklenirken bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Yeni Haber Ekle</h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Haber Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Haber Başlığı</Label>
              <Input
                id="title"
                placeholder="Başlık girin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Kısa Açıklama</Label>
              <Textarea
                id="shortDescription"
                placeholder="Kısa açıklama girin"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishedDate">Oluşturulma Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="publishedDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Yükleniyor...
                      </SelectItem>
                    ) : error ? (
                      <SelectItem value="error" disabled>
                        {error}
                      </SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Kategori bulunamadı
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Anahtar Kelimeler</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 text-xs font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="keywords"
                placeholder="Anahtar kelime ekleyin ve Enter'a basın"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Haber İçeriği</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="content"
              placeholder="Haber içeriğini girin"
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Tıklayın veya sürükleyin
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG veya GIF (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">
          Haberi Kaydet
        </Button>
      </form>
    </div>
  );
}
