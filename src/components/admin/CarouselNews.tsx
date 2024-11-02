"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadCarouselNews } from "@/lib/api";

export default function Carousel() {
  const [title, setTitle] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      toast({
        title: "Hata!",
        description: "Lütfen bir resim dosyası seçin.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await uploadCarouselNews({
        title,
        publishDate,
        image: file,
      });

      console.log("Upload result:", result);

      toast({
        title: "Başarılı!",
        description: "Haber başarıyla yüklendi.",
      });

      // Form alanlarını temizle
      setTitle("");
      setPublishDate("");
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading news item:", error);
      toast({
        title: "Hata!",
        description:
          error instanceof Error
            ? error.message
            : "Haber yüklenirken bilinmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Carousel Haber Yükle</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Resim</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishDate">Yayın Tarihi</Label>
            <Input
              id="publishDate"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
            />
          </div>
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Önizleme"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Yükleniyor..." : "Haberi Yükle"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
