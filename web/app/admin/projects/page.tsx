"use client";

import { useEffect, useState } from "react";
import { backendFetch } from "@/lib/backend-api";

type Project = { id: string; projectCode: string; title: string; brief: string; status: string; budget: string | null; currency: string; createdAt: string; client: { name: string; email: string } };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void backendFetch("/api/v1/requests/projects").then((response) => response.json()).then((data) => {
        if (data.success && Array.isArray(data.data)) setProjects(data.data);
      }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <div className="space-y-6 pb-12"><div><p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">Production pipeline</p><h1 className="mt-2 text-3xl font-extrabold">Projects</h1><p className="mt-1 text-sm text-neutral-600">Accepted client requests ready for production.</p></div>{loading ? <p className="rounded-2xl bg-white/70 p-8 text-center text-sm text-neutral-500">Loading projects…</p> : projects.length === 0 ? <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-10 text-center text-sm text-neutral-600">No accepted projects yet. Accept a project request to see it here.</p> : <div className="grid gap-4 lg:grid-cols-2">{projects.map((project) => <article key={project.id} className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-neutral-500">{project.projectCode}</p><h2 className="mt-1 text-lg font-bold">{project.title}</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-700">{project.status.replaceAll("_", " ")}</span></div><p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{project.brief}</p><div className="mt-4 border-t border-black/[0.06] pt-3 text-xs text-neutral-500"><strong className="text-neutral-800">{project.client.name}</strong><span className="ml-2">{project.client.email}</span></div></article>)}</div>}</div>;
}
