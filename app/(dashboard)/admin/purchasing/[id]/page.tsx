import PurchaseActionDetails from "@/components/admin/purchasing/PurchaseActionDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PurchaseActionDetails id={id} />;
}
