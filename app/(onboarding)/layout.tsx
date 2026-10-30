import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyHotelAction } from "@/app/actions/myHotel";
import { OnboardingTopbar } from "@/components/hotel/onboarding/OnboardingTopbar";

export const dynamic = "force-dynamic";

/** Onboarding: a calm full-width page without the dashboard menu. */
export default async function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (session?.user?.role !== "hotel_manager") redirect("/dashboard");
  const hotel = (await getMyHotelAction()).data;
  if (hotel?.onboarding.completedAt) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingTopbar />
      <main className="px-4 py-8 sm:px-6 lg:py-12">{children}</main>
    </div>
  );
}
