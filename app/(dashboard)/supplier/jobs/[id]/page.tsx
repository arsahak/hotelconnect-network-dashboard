import HotelJobDetails from "@/components/hotel/jobs/HotelJobDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HotelJobDetails id={id} />;
}
