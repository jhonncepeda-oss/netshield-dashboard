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
      <div className="absolute inset-0 bg-[#0B1120]/95 backdrop-blur-md"></div>
      
      <div className="relative bg-slate-900 border border-cyan-500/30 w-full max-w-3xl rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Shield className="text-cyan-400" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Actualizaci?n de T?rminos Legales</h2>
            <p className="text-cyan-400 text-sm">Debes aceptar las nuevas condiciones para continuar usando NetShield Core.</p>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto text-sm text-slate-300 space-y-6 flex-1">
          <p className="text-base text-white">Hemos actualizado nuestras pol?ticas para brindarte un mejor servicio (Versi?n 2.0). A continuaci?n un resumen de los cambios m?s importantes:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-2">T?rminos de Servicio</h3>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li>Se proh?be el abuso de la API y bots.</li>
                <li>Se incluye cl?usula de indemnidad legal.</li>
                <li>SLA: El servicio se provee "Tal Cual".</li>
                <li>Limitaci?n de responsabilidad por falsos positivos.</li>
              </ul>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-2">Pol?tica de Privacidad</h3>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li>Enmascaramiento (Redaction) de credenciales.</li>
                <li>Retenci?n de Datos Ef?mera (Zero-Retention).</li>
                <li>Tus archivos NO se guardan en discos persistentes.</li>
                <li>Transparencia sobre base legal y derechos.</li>
              </ul>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 text-center mt-6">
            Al hacer clic en "Acepto los nuevos t?rminos", confirmas que has le?do y est?s de acuerdo con la totalidad de nuestros T?rminos de Servicio y Pol?tica de Privacidad actualizados.
          </p>
        </div>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Acepto los nuevos t?rminos y condiciones"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
