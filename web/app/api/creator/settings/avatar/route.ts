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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const response = await backendFetch(`${API_BASE}/api/v1/creator/settings/avatar`, {
      method: "PATCH",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("[API /api/creator/settings/avatar PATCH error]", err);
    return NextResponse.json(
      { success: false, message: "Failed to update profile avatar.", error: err?.message },
      { status: 500 }
    );
  }
}
