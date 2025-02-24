import { Suspense } from "react";
import { notFound } from "next/navigation";
import NewsDetail from "@/components/site/NewsDetail";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

async function getNewsByCategory(categoryId: string) {
  const baseUrl = "https://general-gabriella-edaprojects-53fb99e6.koyeb.app";
  const response = await fetch(`${baseUrl}/api/News/category/${categoryId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  const data = await response.json();

  return data.map((item: any) => ({
    ...item,
    imagePath: item.imagePath ? `${baseUrl}${item.imagePath}` : null,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  let initialNews;

  try {
    initialNews = await getNewsByCategory(categoryId);
  } catch (error) {
    console.error("Error fetching category news:", error);
    notFound();
  }

  if (!initialNews || initialNews.length === 0) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsDetail initialData={initialNews} categoryId={categoryId} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { categoryId } = await params;
  const categories = [
    { id: "1badbcb4-1519-4d1e-9198-05d6e6e85808", name: "Son Dakika" },
    { id: "f7ebb650-c7c4-4bba-ae31-0f46be7d62c5", name: "Spor" },
    { id: "4315c6a9-e626-4fbc-b5a3-12cb21e726e5", name: "Teknoloji" },
    { id: "4055215d-8a3d-4616-969c-1761a352ea9b", name: "Gündem" },
    { id: "1c053bec-87b0-42fd-969b-210288ce925a", name: "Siyaset" },
    { id: "ea7fb0ad-9b9c-4d8c-8b53-2421c368e741", name: "Kültür ve Sanat" },
    { id: "67e4f0ff-ac83-48dd-b060-5a4e4ebee54b", name: "Ekonomi" },
    { id: "06a8171f-25f9-4959-9c2a-6649b70af42f", name: "Astroloji" },
    { id: "f353ac34-6ba0-4842-8ced-6b3ec828cdd4", name: "Bilim" },
    { id: "79ca8a19-9fab-4864-879d-7872b0b78deb", name: "Tarih" },
    { id: "3e473960-eb89-4819-bb1f-8da661a0d611", name: "Otomobil" },
    { id: "45c2799c-2170-45b6-95e3-9a2e9746aa7f", name: "Sağlık" },
    { id: "0908ae29-a8d9-4afd-9279-aa61a93f9d2e", name: "Magazin" },
    { id: "834b9924-27b1-48c6-91a3-ada0cc2c1e66", name: "Çevre" },
    { id: "ff678c95-87bc-4ff6-9075-ca645b44ac2b", name: "Eğitim" },
    { id: "80905716-f6d6-4a07-bd8f-e52cb67e2130", name: "Dünya" },
  ];

  const category = categories.find((cat) => cat.id === categoryId);

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    };
  }

  return {
    title: `${category.name} Haberleri`,
    description: `${category.name} kategorisindeki en son haberler`,
  };
}
