import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import PageLayout from "@/components/wrappers/pageLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) return redirect("/login");

  return <PageLayout>{children}</PageLayout>;
}
