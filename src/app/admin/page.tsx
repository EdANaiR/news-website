import AddNewsPage from "@/components/admin/addNews";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Haberler</h1>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <AddNewsPage />
      </div>
    </div>
  );
}
