import AddNewsPage from "@/components/admin/addNews";
import Carousel from "@/components/admin/CarouselNews";

export default function Page() {
  return (
    <div className="flex gap-4">
      <AddNewsPage />
      <Carousel />
    </div>
  );
}
