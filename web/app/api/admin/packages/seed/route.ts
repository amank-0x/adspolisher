import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: Request) {
  try {
    const response = await backendFetch(`${API_BASE}/api/v1/packages/seed-defaults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages/seed POST error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to seed default packages.", error: err?.message },
      { status: 500 }
    );
  }
}
