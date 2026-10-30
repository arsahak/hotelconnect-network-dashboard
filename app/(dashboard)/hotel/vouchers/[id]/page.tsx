import HotelVoucherDetails from "@/components/hotel/vouchers/HotelVoucherDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HotelVoucherDetails id={id} />;
}
