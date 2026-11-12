import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET() {
  try {
    const response = await backendFetch(`${API_BASE}/api/v1/packages`, {
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/packages GET error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch packages.", error: err?.message },
      { status: 500 }
    );
  }
}
