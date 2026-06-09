import { NextResponse } from "next/server";

const NHL_BASE = "https://api-web.nhle.com/v1";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function GET() {
  const res = await fetch(`${NHL_BASE}/standings/now`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
