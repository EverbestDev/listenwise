"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/stats", { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-6">Admin</h2>
      {stats ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-60 backdrop-blur-xl border border-gray-200 p-6 rounded-lg">
            <div className="text-sm text-gray-400">Users</div>
            <div className="text-2xl font-bold">{stats.total_users}</div>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-xl border border-gray-200 p-6 rounded-lg">
            <div className="text-sm text-gray-400">Jobs</div>
            <div className="text-2xl font-bold">{stats.total_jobs}</div>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-xl border border-gray-200 p-6 rounded-lg">
            <div className="text-sm text-gray-400">Today</div>
            <div className="text-2xl font-bold">{stats.today_jobs}</div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">Loading...</div>
      )}
    </div>
  );
}
