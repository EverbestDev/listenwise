"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/ModalProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showModal } = useModal();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      const res = await api.post("/auth/login", form);
      if (res.data?.access_token) {
        localStorage.setItem("token", res.data.access_token);
        router.push("/");
      } else {
        showModal({ title: "Login failed", body: "Invalid response from server" });
      }
    } catch (err) {
      console.error(err);
      showModal({ title: "Login failed", body: "Wrong credentials or server error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-16">
      <h2 className="text-3xl font-semibold mb-6">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded-md bg-white/5"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full p-3 rounded-md bg-white/5"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button className="px-6 py-3 bg-purple-600 rounded-md text-white" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
