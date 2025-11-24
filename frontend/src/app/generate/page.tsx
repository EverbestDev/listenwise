"use client";
import { useState } from "react";
import { useModal } from "@/components/ModalProvider";
import UploadZone from "@/components/UploadZone";
import AudioPlayer from "@/components/AudioPlayer";
import api from "@/lib/api";

export default function GeneratePage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { showModal } = useModal();

  async function handleUpload(file: File | null, youtubeUrl?: string) {
    const form = new FormData();
    if (file) form.append("pdf_file", file);
    if (youtubeUrl) form.append("youtube_url", youtubeUrl);
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/process", form, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      if (res.data?.download_url) {
        setFileUrl(res.data.download_url);
      } else if (res.data?.job_id) {
        setFileUrl(`/download/${res.data.job_id}`);
      }
    } catch (err) {
      console.error(err);
      showModal({ title: "Processing failed", body: "There was a problem processing your file. Please try again." });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-6">Generate audio</h2>
      <UploadZone onUpload={handleUpload} />

      {processing && <div className="mt-6 text-sm text-gray-300">Processing... this can take a minute</div>}

      {fileUrl && (
        <div className="mt-6">
          <AudioPlayer src={fileUrl} />
          <a href={fileUrl} className="block mt-2 text-xs text-gray-400">Download audio</a>
        </div>
      )}
    </div>
  );
}
