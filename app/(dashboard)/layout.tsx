import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { id: string; username: string };

  if (!user) return redirect("/login");

  return <main>{children}</main>;
}
