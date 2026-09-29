"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function UploadConfig() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch("http://localhost:8000/audit/run?hostname=RouterWeb&ip_address=192.168.1.1&os_version=IOS15", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload");
      
      setStatus("success");
      // Reset after 3s
      setTimeout(() => setStatus("idle"), 3000);
      
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <UploadCloud className="text-cyan-400" /> Nuevo Análisis de Configuración
      </h3>
      <p className="text-slate-400 mb-6 text-sm">
        Sube un archivo .cfg de Cisco para analizar sus vulnerabilidades.
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-400">
                <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-slate-500">.cfg files allowed</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".cfg,.txt" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {file && (
          <div className="text-sm text-cyan-300 font-medium bg-cyan-900/30 p-2 rounded text-center">
            Archivo seleccionado: {file.name}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || status === "uploading"}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all flex justify-center items-center gap-2
            ${!file ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25"}
          `}
        >
          {status === "uploading" ? "Analizando..." : status === "success" ? <><CheckCircle className="w-5 h-5"/> ¡Completado!</> : status === "error" ? <><AlertTriangle className="w-5 h-5"/> Error</> : "Iniciar Auditoría"}
        </button>
      </form>
    </div>
  );
}
