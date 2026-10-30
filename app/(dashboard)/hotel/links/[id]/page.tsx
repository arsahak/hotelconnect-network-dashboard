import PortalLinkDetails from "@/components/hotel/links/PortalLinkDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortalLinkDetails id={id} />;
}
