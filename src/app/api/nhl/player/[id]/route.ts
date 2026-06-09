import { NextResponse } from "next/server";

const NHL_BASE = "https://api-web.nhle.com/v1";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${NHL_BASE}/player/${id}/landing`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 1800 },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: `Failed to fetch player ${id}` },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
