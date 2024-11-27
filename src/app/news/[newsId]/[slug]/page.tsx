import { Suspense } from "react";
import { notFound } from "next/navigation";
import NewsDetail from "@/components/site/NewsDetail";
import { getNewsDetail, NewsDetailDto } from "@/lib/api";
import Loading from "@/app/news/[newsId]/loading";

interface PageProps {
  params: Promise<{ newsId: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { newsId } = await params;
  let newsDetail: NewsDetailDto | null = null;

  try {
    newsDetail = await getNewsDetail(newsId);
  } catch (error) {
    console.error("Error fetching news detail:", error);
  }

  if (!newsDetail) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <NewsDetail initialData={newsDetail} categoryId={newsDetail.categoryId} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { newsId } = await params;
  const newsDetail = await getNewsDetail(newsId);

  if (!newsDetail) {
    return { title: "Haber bulunamadı" };
  }

  return {
    title: newsDetail.title,
    description: newsDetail.shortDescription,
  };
}
