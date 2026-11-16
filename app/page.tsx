import { redirect } from "next/navigation";

// The app's root (production: hotelconnect-network.nl/dashboard) opens the
// home page; the proxy sends signed-out visitors to sign-in from there.
export default function RootPage() {
  redirect("/dashboard");
}
