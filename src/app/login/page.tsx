"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, X } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<"TERMS" | "PRIVACY" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !termsAccepted) {
      setError("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }
    setLoading(true);
    setError(null);
    
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { terms_version: 1 }
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
              {isRegistering ? "Crea una cuenta nueva" : "Inicia sesión para continuar"}
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>
            
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
                  Acepto los <button type="button" onClick={() => setShowLegalModal("TERMS")} className="text-cyan-400 hover:text-cyan-300 underline">Términos</button> y la <button type="button" onClick={() => setShowLegalModal("PRIVACY")} className="text-cyan-400 hover:text-cyan-300 underline">Privacidad</button>
                </label>
              </div>
            )}
            
            {error && <div className="text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{error}</div>}

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isRegistering ? "Crear Cuenta" : "Entrar"}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">O continúa con</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                setLoading(true);
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                      prompt: 'select_account'
                    }
                  }
                });
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              Al continuar con Google, aceptas los <button type="button" onClick={() => setShowLegalModal("TERMS")} className="hover:text-slate-400 underline">Términos</button> y la <button type="button" onClick={() => setShowLegalModal("PRIVACY")} className="hover:text-slate-400 underline">Privacidad</button>.
            </p>
          </form>
        </div>
      </div>

      {/* MODAL FLOTANTE */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLegalModal(null)}></div>
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-cyan-400" size={24} />
                {showLegalModal === "TERMS" ? "Términos y Condiciones" : "Política de Privacidad"}
              </h2>
              <button onClick={() => setShowLegalModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-6">
              {showLegalModal === "TERMS" ? (
                <>
                  <p>Última actualización: 29 de septiembre de 2026</p>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">1. Uso Aceptable (Anti-Abuso)</h3>
                    <p>Queda estrictamente prohibido el uso de bots, scripts automatizados, herramientas de scraping o cualquier forma de ingeniería inversa dirigida hacia nuestra API (Backend) para saltarse la interfaz gráfica oficial. Cualquier intento de abuso resultará en la suspensión inmediata de la cuenta.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">2. Cláusula de Indemnidad</h3>
                    <p>NetShield Core opera bajo el principio de buena fe. Al utilizar la plataforma, usted declara bajo juramento tener la autorización legal para analizar las configuraciones subidas. El usuario acepta eximir de toda responsabilidad civil o penal a NetShield Core y a sus creadores en caso de que suba archivos obtenidos ilícitamente o audite redes sin autorización.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">3. Disponibilidad del Servicio (SLA)</h3>
                    <p>El servicio se proporciona "Tal cual" (As-Is). Debido a nuestra arquitectura de servidores en la nube, la plataforma puede presentar tiempos de carga iniciales extendidos (cold-starts) o mantenimientos no programados. No ofrecemos garantías de disponibilidad ininterrumpida (uptime) ni otorgamos derecho a compensaciones por interrupciones del servicio.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">4. Limitación de Responsabilidad</h3>
                    <p>Las auditorías generadas por NetShield Core son herramientas de asistencia y no garantizan la detección del 100% de las vulnerabilidades existentes. Las recomendaciones deben ser revisadas por un profesional de seguridad antes de ser aplicadas en entornos de producción.</p>
                  </section>
                </>
              ) : (
                <>
                  <p>Última actualización: 29 de septiembre de 2026</p>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">1. Enmascaramiento Automático (Redaction)</h3>
                    <p>Nuestro motor de auditoría está programado para ofuscar y enmascarar automáticamente credenciales sensibles, contraseñas en texto plano y hashes detectados en las configuraciones analizadas antes de guardar el reporte, asegurando que estos datos críticos no queden expuestos en los informes.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">2. Retención de Datos Efímera</h3>
                    <p>Por su seguridad y cumplimiento normativo, los archivos de configuración en crudo que usted suba se procesan en memoria y son destruidos instantáneamente. No retenemos ni almacenamos los archivos originales en discos persistentes.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">3. Uso de la Información</h3>
                    <p>Los reportes generados se asocian a su cuenta en la base de datos cifrada de Supabase para que solo usted tenga acceso a ellos.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-white mb-1">4. Base Legal y Derechos del Usuario</h3>
                    <p>El procesamiento de sus datos y archivos se basa en su consentimiento explícito otorgado al aceptar estos términos y enviar sus configuraciones. Usted tiene el derecho de acceder a su historial de auditorías y solicitar la eliminación completa de su cuenta y reportes en cualquier momento.</p>
                  </section>
                </>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <button 
                onClick={() => setShowLegalModal(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors"
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
