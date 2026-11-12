"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FolderKanban, LoaderCircle, Mail, RefreshCw, Users } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isYou: boolean;
  roleTitle: string;
  portfolioUrl: string | null;
  secondaryUrl: string | null;
};

type CreatorTeam = {
  id: string;
  projectCode: string;
  title: string;
  status: string;
  yourRole: string;
  members: TeamMember[];
};

function safeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch { return null; }
}

export default function CreatorTeamsPage() {
  const [teams, setTeams] = useState<CreatorTeam[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendFetch("/api/v1/creator/teams", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not load your project teams.");
      const nextTeams: CreatorTeam[] = payload.data || [];
      setTeams(nextTeams);
      setSelectedProjectId((current) => nextTeams.some((team) => team.id === current) ? current : nextTeams[0]?.id || "");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your project teams.");
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadTeams(); }, []);
  const selectedTeam = useMemo(() => teams.find((team) => team.id === selectedProjectId) || null, [teams, selectedProjectId]);

  if (loading) return <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-neutral-500"><LoaderCircle className="animate-spin" size={17}/> Loading your teams…</div>;

  return <div className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#4F46E5]">Workspace</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">My teams</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Connect with creators assigned to the same projects. Teammate contact and shared portfolio links are shown here.</p></div><button type="button" onClick={() => void loadTeams()} className="inline-flex items-center gap-2 self-start rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 sm:self-auto"><RefreshCw size={14}/>Refresh</button></header>

    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}

    {teams.length === 0 ? <section className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-10 text-center"><Users className="mx-auto text-neutral-300" size={30}/><h2 className="mt-3 text-base font-bold">No project teams yet</h2><p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">When you accept a project offer and join a project team, your teammates will appear here.</p></section> : <>
      <section className="flex flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><FolderKanban size={18}/></span><div><p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Choose a project</p><p className="text-sm font-semibold text-neutral-900">{selectedTeam?.projectCode} · {selectedTeam?.title}</p></div></div><select aria-label="Select project team" value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 outline-none focus:border-indigo-500 sm:max-w-sm">{teams.map((team) => <option key={team.id} value={team.id}>{team.projectCode} · {team.title}</option>)}</select></section>

      {selectedTeam && <>
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-neutral-950 p-5 text-white sm:px-6"><div><p className="font-mono text-[10px] text-white/55">{selectedTeam.projectCode}</p><h2 className="mt-1 text-lg font-bold">{selectedTeam.title}</h2><p className="mt-1 text-xs text-white/65">Your role: {selectedTeam.yourRole}</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide">{selectedTeam.status.replaceAll("_", " ")}</span></section>

        <section><div className="mb-3 flex items-center justify-between"><div><h2 className="text-base font-bold text-neutral-900">Project teammates</h2><p className="mt-1 text-xs text-neutral-500">{selectedTeam.members.length} {selectedTeam.members.length === 1 ? "member" : "members"} on this accepted project</p></div></div>
          {selectedTeam.members.length === 0 ? <div className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-8 text-center text-sm text-neutral-500">No accepted team members are listed for this project yet.</div> : <div className="grid gap-4 md:grid-cols-2">{selectedTeam.members.map((member) => {
            const portfolio = safeExternalUrl(member.portfolioUrl);
            const social = safeExternalUrl(member.secondaryUrl);
            return <article key={member.id} className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-base font-bold text-indigo-700">{member.image ? <img src={member.image} alt="" className="h-full w-full object-cover"/> : (member.name || member.email || "C").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold text-neutral-950">{member.name || "Creator"}</h3>{member.isYou && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700">YOU</span>}</div><p className="mt-0.5 text-xs text-neutral-500">{member.roleTitle}</p></div></div><a href={`mailto:${member.email}`} className="mt-4 flex items-center gap-2 break-all rounded-xl bg-neutral-50 px-3 py-2.5 text-xs font-medium text-neutral-700 hover:text-indigo-700"><Mail size={14} className="shrink-0"/>{member.email}</a><div className="mt-3 flex flex-wrap gap-2">{portfolio && <a href={portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-[11px] font-semibold text-neutral-700 hover:border-indigo-200 hover:text-indigo-700">Portfolio <ExternalLink size={12}/></a>}{social && <a href={social} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-[11px] font-semibold text-neutral-700 hover:border-indigo-200 hover:text-indigo-700">Social / website <ExternalLink size={12}/></a>}{!portfolio && !social && <span className="text-[11px] text-neutral-400">No external links added</span>}</div></article>;
          })}</div>}
        </section>
      </>}
    </>}
  </div>;
}
