import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-api";

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const response = await backendFetch(`${API_BASE}/api/v1/creator/projects/${encodeURIComponent(projectId)}`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API /api/creator/projects/[projectId] GET error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch creator project details." },
      { status: 500 },
    );
  }
}
