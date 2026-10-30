import TenderDetails from "@/components/hotel/tenders/TenderDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TenderDetails id={id} />;
}
