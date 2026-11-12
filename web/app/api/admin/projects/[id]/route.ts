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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}`, {
      headers: authHeaders(req),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id] GET error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const response = await backendFetch(`${API_BASE}/api/v1/projects/${id}`, {
      method: "PATCH",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id] PATCH error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project.", error: error?.message },
      { status: 500 }
    );
  }
}
