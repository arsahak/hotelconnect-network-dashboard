// Sign-in pages: full screen, no sidebar or topbar.
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex min-h-screen flex-col">{children}</main>;
}
