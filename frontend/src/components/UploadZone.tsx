"use client";
import { useCallback, useState } from "react";

export default function UploadZone({ onUpload }: { onUpload: (file: File | null, youtubeUrl?: string) => void }) {
  const [youtube, setYoutube] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onUpload(file || null);
  }, [onUpload]);

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center"
      >
        <div className="text-gray-400 mb-2">Drag & drop a PDF here</div>
        <div className="text-sm text-gray-500">or</div>
        <div className="mt-4 flex gap-2 justify-center">
          <input
            placeholder="YouTube URL"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            className="bg-white/5 p-2 rounded-md w-80"
          />
          <button
            onClick={() => onUpload(null, youtube)}
            className="px-4 py-2 bg-purple-600 rounded-md text-white"
          >
            Use URL
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400">Or click to choose a file:</div>
      <input type="file" accept="application/pdf" onChange={(e) => onUpload(e.target.files?.[0] || null)} className="mt-2" />
    </div>
  );
}
