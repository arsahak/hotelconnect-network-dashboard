import VoucherDetails from "@/components/admin/vouchers/VoucherDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VoucherDetails id={id} />;
}
