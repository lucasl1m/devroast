import { ImageResponse } from "@takumi-rs/image-response";
import { NextRequest, NextResponse } from "next/server";
import { generateRoastImage, RoastImage } from "@/components/og/roast-image";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  try {
    const { score, badge, language, lineCount, verdict } = await generateRoastImage(id);

    const image = new ImageResponse(
      <RoastImage
        score={score}
        badge={badge}
        language={language}
        lineCount={lineCount}
        verdict={verdict}
      />,
      {
        width: 1200,
        height: 630,
      }
    );

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Roast not found") {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.error("OG image generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
