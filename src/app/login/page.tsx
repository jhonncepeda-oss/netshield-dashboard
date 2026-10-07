"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // Premium glass colors
  const strengthColor = 
    strength <= 2 ? "bg-red-400" : 
    strength <= 4 ? "bg-yellow-400" : "bg-cyan-400";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !termsAccepted) {
      setError("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        if (strength < 3) throw new Error("La contraseña es muy débil.");
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { terms_version: 2 } // Initialize with latest terms version
          }
        });
        if (signUpError) throw signUpError;
        router.push("/");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glassmorphism Background Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-900/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-900/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">NetShield</h1>
            <p className="text-white/60 text-sm mt-2 tracking-wide uppercase">
              {isRegistering ? "Crear Nueva Cuenta" : "Acceso Autorizado"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white p-3.5 rounded-xl focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                placeholder="operador@netshield.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white p-3.5 pr-12 rounded-xl focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-mono"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegistering && password.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={`h-full flex-1 transition-all duration-300 ${strength >= level ? strengthColor : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    {strength <= 2 ? "Débil" : strength <= 4 ? "Media" : "Fuerte"}
                  </p>
                </div>
              )}
            </div>

            {isRegistering && (
              <div className="flex items-start gap-3 mt-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 bg-transparent border-white/20 rounded focus:ring-0 checked:bg-white checked:border-white cursor-pointer"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="font-medium text-white/80 cursor-pointer">
                    Acepto los términos legales
                  </label>
                  <p className="text-white/50 text-xs mt-1">
                    Al registrarte, aceptas nuestros{' '}
                    <button type="button" onClick={() => setShowLegalModal("TERMS")} className="text-white underline hover:text-cyan-400">Términos de servicio</button>
                    {' '}y la{' '}
                    <button type="button" onClick={() => setShowLegalModal("PRIVACY")} className="text-white underline hover:text-cyan-400">Política de privacidad</button>.
                  </p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-medium p-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center h-14 mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : isRegistering ? "Crear cuenta" : "Iniciar sesión"}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/40 text-xs uppercase tracking-widest">o</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                setLoading(true);
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: { prompt: 'select_account' }
                  }
                });
              }}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium p-4 rounded-xl transition-colors disabled:opacity-50 h-14"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {isRegistering ? "¿Ya tienes una cuenta? Iniciar sesión" : "¿No tienes cuenta? Solicitar acceso"}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLegalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/5 border border-white/10 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  {showLegalModal === "TERMS" ? "Términos de servicio" : "Política de Privacidad"}
                </h3>
                <button 
                  onClick={() => setShowLegalModal(null)}
                  className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-xl border border-white/10 hover:border-white/30"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto text-sm text-white/70 space-y-8 leading-relaxed custom-scrollbar">
                {showLegalModal === "TERMS" ? (
                  <>
                    <p className="text-white/50">Última actualización: 29 de septiembre de 2026</p>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">1. Uso Aceptable</h3>
                      <p>Queda estrictamente prohibido el uso de bots, scripts automatizados, herramientas de scraping o cualquier forma de ingeniería inversa dirigida hacia nuestra API. Cualquier intento de abuso resultará en la suspensión inmediata de la cuenta.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">2. Cláusula de Indemnidad</h3>
                      <p>NetShield opera bajo el principio de buena fe. Al utilizar la plataforma, usted declara bajo juramento tener la autorización legal para analizar las configuraciones subidas. El usuario acepta eximir de toda responsabilidad a NetShield en caso de auditorías no autorizadas.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">3. Disponibilidad</h3>
                      <p>El servicio se proporciona "Tal cual" (As-Is). Debido a nuestra arquitectura cloud, la plataforma puede presentar tiempos de carga o mantenimientos. No ofrecemos garantías de disponibilidad ininterrumpida.</p>
                    </section>
                  </>
                ) : (
                  <>
                    <p className="text-white/50">Última actualización: 29 de septiembre de 2026</p>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">1. Enmascaramiento Automático</h3>
                      <p>Nuestro motor de auditoría está programado para ofuscar automáticamente credenciales sensibles, contraseñas en texto plano y hashes detectados en las configuraciones antes de guardar el reporte.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">2. Retención Efímera</h3>
                      <p>Los archivos de configuración en crudo se procesan en memoria y son destruidos instantáneamente. No retenemos los archivos originales en discos persistentes.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-widest">3. Propiedad de Datos</h3>
                      <p>Los reportes generados se asocian criptográficamente a su cuenta. Usted tiene el derecho de acceder, exportar o solicitar la eliminación completa de sus datos en cualquier momento.</p>
                    </section>
                  </>
                )}
              </div>
              <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowLegalModal(null)}
                  className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-xl transition-colors shadow-lg"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}