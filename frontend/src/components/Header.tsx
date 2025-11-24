export default function Header() {
  return (
    <header className="glass border-b border-white/10 px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
          <div>
            <p className="text-sm text-gray-400">Welcome back</p>
            <p className="font-semibold">Abidemi</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
}