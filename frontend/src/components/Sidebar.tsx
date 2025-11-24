"use client";
import { Home, Brain, History, Settings, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Brain, label: "Generate", href: "/generate" },
  { icon: History, label: "Library", href: "/history" },
  { icon: Sparkles, label: "Admin", href: "/admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-64 glass h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ListenWise
        </h1>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-400 w-full"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}