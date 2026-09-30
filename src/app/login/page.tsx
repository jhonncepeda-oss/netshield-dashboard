"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, X, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<"TERMS" | "PRIVACY" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Password validation
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const strength = Object.values(validations).filter(Boolean).length;
  const strengthColor = 
    strength <= 2 ? "bg-rose-500" : 
    strength <= 4 ? "bg-amber-500" : "bg-emerald-500";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !termsAccepted) {
      setError("Debes aceptar los t?rminos y condiciones para registrarte.");
      return;
    }
    if (isRegistering && strength < 5) {
      setError("La contrase?a no cumple con todos los requisitos de seguridad.");
      return;
    }
    setLoading(true);
    setError(null);
    
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { terms_version: 2 }
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setError("Revisa tu correo para confirmar el registro.");
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md">
          
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">NetShield Core</h2>
            <p className="text-slate-400 text-sm mt-1">
              {isRegistering ? "Crea una cuenta nueva" : "Inicia sesi?n para continuar"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="admin@empresa.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contrase?a</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="????????"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isRegistering && password && (
              <div className="space-y-2 mt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={h-full transition-all duration-300 } 
                    style={{ width: ${(strength / 5) * 100}% }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className={validations.length ? "text-emerald-400" : "text-slate-500"}>M?nimo 8 caracteres</span>
                  <span className={validations.upper ? "text-emerald-400" : "text-slate-500"}>Una may?scula</span>
                  <span className={validations.lower ? "text-emerald-400" : "text-slate-500"}>Una min?scula</span>
                  <span className={validations.number ? "text-emerald-400" : "text-slate-500"}>Un n?mero</span>
                  <span className={validations.special ? "text-emerald-400" : "text-slate-500"}>Un car?cter especial</span>
                </div>
              </div>
            )}
            
            {isRegistering && (
               <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  Acepto los{' '}
                  <button type="button" onClick={() => setShowLegalModal("TERMS")} className="text-cyan-400 hover:underline">t?rminos</button>
                  {' '}y{' '}
                  <button type="button" onClick={() => setShowLegalModal("PRIVACY")} className="text-cyan-400 hover:underline">privacidad</button>
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium p-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Cargando..." : isRegistering ? "Crear Cuenta" : "Iniciar Sesi?n"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              {isRegistering ? "?Ya tienes cuenta? Inicia sesi?n" : "?No tienes cuenta? Reg?strate"}
            </button>
          </div>
        </div>
      </div>

      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {showLegalModal === "TERMS" ? "T?rminos y Condiciones" : "Pol?tica de Privacidad"}
              </h3>
              <button 
                onClick={() => setShowLegalModal(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4">
              {showLegalModal === "TERMS" ? (
                <>
                  <p>Al utilizar NetShield Core, usted acepta estos t&eacute;rminos de servicio...</p>
                  <p>1. Servicio SaaS: Se provee una herramienta de auditor&iacute;a sin garant&iacute;a impl&iacute;cita.</p>
                  <p>2. Privacidad de Datos: Solo se procesan archivos de configuraci&oacute;n subidos manualmente.</p>
                </>
              ) : (
                <>
                  <p>Su privacidad es importante para nosotros.</p>
                  <p>1. Datos que recopilamos: Correos electr&oacute;nicos e IPs conectadas.</p>
                  <p>2. Retenci&oacute;n temporal: Los archivos .cfg y .txt son eliminados en tiempo real (Zero-Retention).</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowLegalModal(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
