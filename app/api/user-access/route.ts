import { NextRequest, NextResponse } from "next/server";

const WHOP_API_KEY = process.env.WHOP_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const response = await fetch(`https://api.whop.com/api/v1/members/${userId}`, {
      headers: { "Authorization": `Bearer ${WHOP_API_KEY}` }
    });

    if (!response.ok) {
      return NextResponse.json({ products: [] });
    }

    const memberData = await response.json();
    const products = memberData.memberships?.map((m: any) => m.product_id) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
