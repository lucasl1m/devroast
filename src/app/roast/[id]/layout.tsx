import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://devroast.com";
  
  return {
    openGraph: {
      images: [`${baseUrl}/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${baseUrl}/api/og/${id}`],
    },
  };
}

export default function RoastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
