"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HistoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/stats", { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        // That endpoint returns stats; we'll show placeholder until a jobs endpoint exists
        setJobs([{ id: 1, title: "Example Job", created_at: new Date().toISOString() }]);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-6">Library</h2>
      <div className="space-y-4">
        {jobs.map((j) => (
          <div key={j.id} className="glass p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-xs text-gray-400">{new Date(j.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-300">Play</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
