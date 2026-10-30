import StoryDetails from "@/components/admin/stories/StoryDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryDetails id={id} />;
}
