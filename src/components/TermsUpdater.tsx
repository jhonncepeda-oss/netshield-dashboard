"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsUpdater({ currentVersion }: { currentVersion: number }) {
  const REQUIRED_VERSION = 2; // Increment this whenever terms are updated!
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  if (currentVersion >= REQUIRED_VERSION) return null;

  const handleAccept = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { terms_version: REQUIRED_VERSION }
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      
      <div className="relative bg-white/5 border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Actualización de Términos Legales</h2>
            <p className="text-white/60 text-sm mt-1">Debes aceptar las nuevas condiciones para continuar usando NetShield Core.</p>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto text-sm text-white/70 space-y-6 flex-1 custom-scrollbar">
          <p className="text-base text-white/90">Hemos actualizado nuestras políticas para brindarte un mejor servicio (Versión 2.0). A continuación un resumen de los cambios más importantes:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-medium text-white mb-3">Términos de Servicio</h3>
              <ul className="space-y-3 list-disc list-inside text-white/60">
                <li>Se prohíbe el abuso de la API y bots.</li>
                <li>Se incluye cláusula de indemnidad legal.</li>
                <li>SLA: El servicio se provee "Tal Cual".</li>
                <li>Limitación de responsabilidad por falsos positivos.</li>
              </ul>
            </div>
            
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-medium text-white mb-3">Política de Privacidad</h3>
              <ul className="space-y-3 list-disc list-inside text-white/60">
                <li>Enmascaramiento (Redaction) de credenciales.</li>
                <li>Retención de Datos Efímera (Zero-Retention).</li>
                <li>Tus archivos NO se guardan en discos persistentes.</li>
                <li>Transparencia sobre base legal y derechos.</li>
              </ul>
            </div>
          </div>
          
          <p className="text-xs text-white/40 text-center mt-6 px-4">
            Al hacer clic en "Acepto los nuevos términos", confirmas que has leído y estás de acuerdo con la totalidad de nuestros Términos de Servicio y Política de Privacidad actualizados.
          </p>
        </div>
        
        <div className="p-6 border-t border-white/10 bg-white/5">
          <button 
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-medium py-4 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            ) : (
              "Acepto los nuevos términos y condiciones"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
