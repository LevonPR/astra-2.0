"use client";

import { useState } from "react";

type Task = { id: string; title: string; role: string; status: string; acceptance: string; budgetCents: number; assignee: string | null; evidence: string[] };

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [role, setRole] = useState("all");
  const visible = tasks.filter(task => role === "all" || task.role === role);
  return <>
    <label className="hub-filter">Role <select value={role} onChange={event => setRole(event.target.value)}>
      <option value="all">All roles</option>{Array.from(new Set(tasks.map(task => task.role))).map(value => <option key={value} value={value}>{value}</option>)}
    </select></label>
    <p className="hub-muted" aria-live="polite">{visible.length} tasks shown</p>
    <div className="grid">{visible.map(task => {
      const params = new URLSearchParams({ template: "hub-proposal.yml", title: `[HUB] ${task.id} — ${task.title}` });
      return <article className="card" key={task.id}>
        <div className="eyebrow">{task.id} / {task.role}</div><h3>{task.title}</h3><span className="pill">{task.status}</span>
        <p>{task.acceptance}</p><p>Assigned: {task.assignee || "Unassigned"} · Evidence: {task.evidence.length} links</p>
        <p>Proposed spend: ${(task.budgetCents / 100).toFixed(2)} · approval is separate</p>
        <a href={`https://github.com/LevonPR/astra-2.0/issues/new?${params}`}>Propose assignment ↗</a>
      </article>;
    })}</div>
  </>;
}
