import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request, includeContentType = false) {
  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

export async function GET(req: Request) {
  try {
    const query = new URL(req.url).search;
    const response = await backendFetch(`${API_BASE}/api/v1/admin/proposals${query}`, {
      headers: authHeaders(req),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[API /api/admin/proposals GET error]", error);
    return NextResponse.json({ success: false, message: "Failed to load proposals." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const response = await backendFetch(`${API_BASE}/api/v1/admin/proposals`, {
      method: "POST",
      headers: authHeaders(req, true),
      body: JSON.stringify(await req.json()),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[API /api/admin/proposals POST error]", error);
    return NextResponse.json({ success: false, message: "Failed to create proposal." }, { status: 500 });
  }
}
