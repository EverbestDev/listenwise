export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-400 mb-6">We couldn't find that page.</p>
        <a href="/" className="px-6 py-3 bg-purple-600 rounded-md text-white">Go home</a>
      </div>
    </div>
  );
}
