import HotelDetails from "@/components/admin/hotels/HotelDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HotelDetails id={id} />;
}
