import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

export async function POST(req: Request) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
      authorization: req.headers.get("authorization") || "",
    };

    if (process.env.ADMIN_SECRET_KEY) {
      headers["x-admin-key"] = process.env.ADMIN_SECRET_KEY;
    }

    const response = await backendFetch(`${API_BASE}/api/v1/packages/seed-defaults`, {
      method: "POST",
      headers,
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: response.ok, message: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/admin/packages/seed POST error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to seed default packages.", error: err?.message },
      { status: 500 }
    );
  }
}
