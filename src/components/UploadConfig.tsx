"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
      
      const mockIp = "192.168." + Math.floor(Math.random() * 255) + ".1";
      const mockHostname = "Router-" + Math.floor(Math.random() * 1000);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", session?.user?.id || "anonymous");
      formData.append("hostname", mockHostname);
      formData.append("ip_address", mockIp);
      formData.append("os_version", "IOS15");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const res = await fetch(`${apiUrl}/audit/run`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error("Server Error Detail:", errData);
        throw new Error(errData?.detail || "Error interno del servidor al procesar el archivo.");
      }

      setStatus("success");
      // Trigger a refresh in ReportTable
      window.dispatchEvent(new Event("reportUploaded"));
      
      setTimeout(() => {
        setFile(null);
        setStatus("idle");
      }, 3000);
      
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Error desconocido");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden font-sans">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2.5 bg-[#111] border border-neutral-800 rounded-md">
            <UploadCloud className="text-white w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white tracking-tight">Nueva Auditoría</h2>
            <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">Sube tu archivo .cfg de Cisco</p>
          </div>
        </div>

        <motion.div 
          layout
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          animate={{ scale: dragActive ? 1.01 : 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`border border-dashed rounded-xl p-10 text-center transition-colors relative overflow-hidden ${
            dragActive ? "border-neutral-500 bg-[#111]" : "border-neutral-800 bg-[#050505]"
          } ${status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input 
            type="file" 
            id="fileUpload" 
            className="hidden" 
            accept=".cfg,.txt" 
            onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
          />
          
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div 
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="p-3 bg-[#111] rounded-full border border-neutral-800 mb-2">
                  <CheckCircle2 className="text-white w-6 h-6" strokeWidth={1.5} />
                </div>
                {/* TRUNCATE FIX FOR LONG NAMES */}
                <p className="text-neutral-300 font-mono text-sm max-w-full truncate px-4">{file.name}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                <button 
                  onClick={() => {setFile(null); setStatus("idle");}}
                  className="text-neutral-400 text-xs uppercase tracking-widest hover:text-white mt-4 border border-neutral-800 rounded-md px-3 py-1.5 hover:bg-[#222] transition-colors"
                  disabled={status === "uploading"}
                >
                  Cambiar archivo
                </button>
              </motion.div>
            ) : (
              <motion.label 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                htmlFor="fileUpload" 
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadCloud className="text-neutral-600 mb-5 w-10 h-10" strokeWidth={1.5} />
                <p className="text-neutral-300 font-medium text-sm mb-1">Arrastra tu archivo aquí</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-8">o haz clic para explorar</p>
                <div className="bg-white text-black px-6 py-2.5 rounded-md font-medium hover:bg-neutral-200 transition-colors text-sm">
                  Seleccionar Archivo
                </div>
              </motion.label>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-md flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span className="font-mono">{errorMessage}</span>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-[#111] border border-neutral-800 rounded-md flex items-center gap-3 text-white text-sm">
                <CheckCircle2 size={16} />
                <span className="font-mono">Auditoría completada y guardada exitosamente.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-[#050505] border-t border-neutral-800">
        <button 
          className={`w-full py-3.5 rounded-md font-medium flex items-center justify-center gap-3 transition-colors text-sm ${
            !file || status === "success" || status === "uploading" 
              ? "bg-[#111] text-neutral-600 border border-neutral-800 cursor-not-allowed" 
              : "bg-white text-black hover:bg-neutral-200"
          }`}
          disabled={!file || status === "uploading" || status === "success"}
          onClick={handleUpload}
        >
          {status === "uploading" ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="uppercase tracking-widest">Procesando...</span>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="uppercase tracking-widest">Generado</span>
            </>
          ) : (
            <span className="uppercase tracking-widest">Iniciar Análisis</span>
          )}
        </button>
      </div>
    </div>
  );
}
