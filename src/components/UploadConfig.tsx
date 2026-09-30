"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function UploadConfig() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".cfg") && !selectedFile.name.endsWith(".txt")) {
      setStatus("error");
      setErrorMessage("Solo se permiten archivos .cfg o .txt");
      return;
    }
    setFile(selectedFile);
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", session?.user?.id || "anonymous");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const mockIp = "192.168." + Math.floor(Math.random() * 255) + ".1";
      const mockHostname = "Router-" + Math.floor(Math.random() * 1000);
      
      const res = await fetch(`${apiUrl}/audit/run?hostname=${mockHostname}&ip_address=${mockIp}&os_version=IOS15`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en el servidor al auditar.");
      }

      setStatus("success");
      setTimeout(() => {
        setFile(null);
        setStatus("idle");
      }, 3000);
      
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Error desconocido");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <UploadCloud className="text-cyan-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Auditar Nueva Configuración</h2>
          <p className="text-slate-400 text-sm">Sube tu archivo .cfg de Cisco</p>
        </div>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
          dragActive ? "border-cyan-400 bg-cyan-400/5" : "border-slate-700 bg-slate-800/30"
        } ${status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input 
          type="file" 
          id="fileUpload" 
          className="hidden" 
          accept=".cfg,.txt" 
          onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-800 rounded-full mb-2">
              <CheckCircle2 className="text-emerald-400" size={32} />
            </div>
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
            <button 
              onClick={() => {setFile(null); setStatus("idle");}}
              className="text-cyan-400 text-sm hover:underline mt-2"
              disabled={status === "uploading"}
            >
              Cambiar archivo
            </button>
          </div>
        ) : (
          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="text-slate-500 mb-4" size={48} />
            <p className="text-slate-300 font-medium text-lg mb-1">Arrastra tu archivo aquí</p>
            <p className="text-slate-500 text-sm mb-6">o haz clic para explorar (.cfg)</p>
            <div className="bg-slate-800 text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700">
              Seleccionar Archivo
            </div>
          </label>
        )}
      </div>

      {/* Alerts */}
      {status === "error" && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-sm animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-400 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={18} />
          <span>Auditoría completada exitosamente.</span>
        </div>
      )}

      <button 
        className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
          !file || status === "success" || status === "uploading" 
            ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed" 
            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/50 hover:shadow-cyan-500/25 border border-cyan-500"
        }`}
        disabled={!file || status === "uploading" || status === "success"}
        onClick={handleUpload}
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Analizando en la nube...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 size={20} />
            Reporte Generado
          </>
        ) : (
          "Iniciar Auditoría"
        )}
      </button>
    </div>
  );
}
