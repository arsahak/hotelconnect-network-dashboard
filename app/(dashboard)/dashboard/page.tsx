import { auth } from "@/auth";
import DashboardHome from "@/components/dashboard/DashboardHome";
import HotelHome from "@/components/hotel/HotelHome";
import FloorHome from "@/components/floor/FloorHome";
import SupplierHome from "@/components/supplier/SupplierHome";

/** Start page per role: hotel managers get the year calendar, hotel staff the floor app, suppliers their requests. */
export default async function page() {
  const role = (await auth())?.user?.role;
  if (role === "hotel_manager") return <HotelHome />;
  if (role === "hotel_staff") return <FloorHome />;
  if (role === "supplier") return <SupplierHome />;
  return <DashboardHome />;
}
