import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request) {
  return {
    "Content-Type": "application/json",
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const endpoint = `${API_BASE}/api/v1/admin/portfolio/creators${queryString ? `?${queryString}` : ""}`;

    const response = await backendFetch(endpoint, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/portfolio GET error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch creator portfolios.", error: error?.message },
      { status: 500 }
    );
  }
}
