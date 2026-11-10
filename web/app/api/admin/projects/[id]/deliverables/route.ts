import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request) {
  return {
    "Content-Type": "application/json",
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const response = await fetch(`${API_BASE}/api/v1/projects/${id}/deliverables`, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/admin/projects/[id]/deliverables POST error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to add deliverable.", error: error?.message },
      { status: 500 }
    );
  }
}
