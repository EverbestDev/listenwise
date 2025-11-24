"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HistoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/jobs/", { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/jobs/", { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        setJobs(res.data || []);
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
          <div key={j.job_id || j.id} className="bg-white bg-opacity-60 backdrop-blur-xl border border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-xs text-gray-400">{j.created_at ? new Date(j.created_at).toLocaleString() : ''}</div>
              </div>
              <div className="text-sm text-gray-300">{j.status || ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
