import PageLayout from "@/components/wrappers/pageLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
