"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";

export default function WrapperComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname === "/") toast.dismiss();
  }, [pathname]);

  return <SessionProvider>{children}</SessionProvider>;
}
