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
    const response = await backendFetch(`${API_BASE}/api/v1/creator/portfolio`, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/creator/portfolio GET error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch creator portfolio.", error: err?.message },
      { status: 500 }
    );
  }
}
