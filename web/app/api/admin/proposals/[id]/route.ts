import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function authHeaders(req: Request) {
  return {
    "Content-Type": "application/json",
    cookie: req.headers.get("cookie") || "",
    authorization: req.headers.get("authorization") || "",
  };
}

async function proxy(req: Request, id: string, suffix = "") {
  const response = await fetch(`${API_BASE}/api/v1/admin/proposals/${id}${suffix}`, {
    method: req.method,
    headers: authHeaders(req),
    ...(req.method === "PATCH" ? { body: JSON.stringify(await req.json()) } : {}),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await proxy(req, id);
  } catch (error) {
    console.error("[API /api/admin/proposals/[id] PATCH error]", error);
    return NextResponse.json({ success: false, message: "Failed to update proposal." }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await proxy(req, id, "/send");
  } catch (error) {
    console.error("[API /api/admin/proposals/[id] send error]", error);
    return NextResponse.json({ success: false, message: "Failed to send proposal." }, { status: 500 });
  }
}
