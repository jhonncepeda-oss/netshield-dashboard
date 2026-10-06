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
  
  // Brutalist monochrome colors
  const strengthColor = 
    strength <= 2 ? "bg-red-500" : 
    strength <= 4 ? "bg-yellow-500" : "bg-white";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !termsAccepted) {
      setError("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }
    if (isRegistering && strength < 5) {
      setError("La contraseña no cumple con todos los requisitos de seguridad.");
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-neutral-300">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#0a0a0a] p-8 rounded-xl border border-neutral-800 shadow-2xl w-full max-w-md relative overflow-hidden"
        >
          {/* Subtle noise/grid removed for ultra minimalism */}
          
          <div className="flex flex-col mb-8">
            <div className="mb-4">
              <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-medium text-white tracking-tight">NetShield</h2>
            <p className="text-neutral-500 text-sm mt-1">
              {isRegistering ? "Crea una cuenta nueva" : "Inicia sesión en la plataforma"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-neutral-800 rounded-md p-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                placeholder="admin@empresa.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-neutral-800 rounded-md p-3 pr-10 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isRegistering && password && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2">
                    <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
                      <motion.div 
                        layout
                        className={`h-full ${strengthColor}`} 
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength / 5) * 100}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] uppercase tracking-wider">
                      <span className={validations.length ? "text-white" : "text-neutral-600 transition-colors"}>Mínimo 8 caracteres</span>
                      <span className={validations.upper ? "text-white" : "text-neutral-600 transition-colors"}>Mayúscula</span>
                      <span className={validations.lower ? "text-white" : "text-neutral-600 transition-colors"}>Minúscula</span>
                      <span className={validations.number ? "text-white" : "text-neutral-600 transition-colors"}>Número</span>
                      <span className={validations.special ? "text-white" : "text-neutral-600 transition-colors"}>Especial</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isRegistering && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 mt-4 pt-2">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-neutral-700 bg-[#111] text-white focus:ring-white focus:ring-offset-black accent-white"
                    />
                    <label htmlFor="terms" className="text-xs text-neutral-400 leading-relaxed">
                      Al registrarme, acepto los{' '}
                      <button type="button" onClick={() => setShowLegalModal("TERMS")} className="text-white hover:underline underline-offset-4 decoration-neutral-600">Términos de servicio</button>
                      {' '}y la{' '}
                      <button type="button" onClick={() => setShowLegalModal("PRIVACY")} className="text-white hover:underline underline-offset-4 decoration-neutral-600">Política de privacidad</button>.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-200 text-black font-medium p-3 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center h-12 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegistering ? "Crear cuenta" : "Iniciar sesión"}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink-0 mx-4 text-neutral-600 text-xs uppercase tracking-widest">o</span>
              <div className="flex-grow border-t border-neutral-800"></div>
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
              className="w-full flex items-center justify-center gap-3 bg-[#111] hover:bg-[#1a1a1a] border border-neutral-800 text-white font-medium p-3 rounded-md transition-colors disabled:opacity-50 h-12"
              disabled={loading}
            >
              <svg className="w-4 h-4 opacity-80 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-xs text-neutral-500 hover:text-white transition-colors"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-900">
                <h3 className="text-lg font-medium text-white tracking-tight">
                  {showLegalModal === "TERMS" ? "Términos de servicio" : "Política de Privacidad"}
                </h3>
                <button 
                  onClick={() => setShowLegalModal(null)}
                  className="text-neutral-500 hover:text-white transition-colors bg-[#111] p-2 rounded-md border border-neutral-800 hover:border-neutral-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-sm text-neutral-400 space-y-6 leading-relaxed">
                {showLegalModal === "TERMS" ? (
                  <>
                    <p>Última actualización: 29 de septiembre de 2026</p>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">1. Uso Aceptable</h3>
                      <p>Queda estrictamente prohibido el uso de bots, scripts automatizados, herramientas de scraping o cualquier forma de ingeniería inversa dirigida hacia nuestra API. Cualquier intento de abuso resultará en la suspensión inmediata de la cuenta.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">2. Cláusula de Indemnidad</h3>
                      <p>NetShield opera bajo el principio de buena fe. Al utilizar la plataforma, usted declara bajo juramento tener la autorización legal para analizar las configuraciones subidas. El usuario acepta eximir de toda responsabilidad a NetShield en caso de auditorías no autorizadas.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">3. Disponibilidad</h3>
                      <p>El servicio se proporciona "Tal cual" (As-Is). Debido a nuestra arquitectura cloud, la plataforma puede presentar tiempos de carga o mantenimientos. No ofrecemos garantías de disponibilidad ininterrumpida.</p>
                    </section>
                  </>
                ) : (
                  <>
                    <p>Última actualización: 29 de septiembre de 2026</p>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">1. Enmascaramiento Automático</h3>
                      <p>Nuestro motor de auditoría está programado para ofuscar automáticamente credenciales sensibles, contraseñas en texto plano y hashes detectados en las configuraciones antes de guardar el reporte.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">2. Retención Efímera</h3>
                      <p>Los archivos de configuración en crudo se procesan en memoria y son destruidos instantáneamente. No retenemos los archivos originales en discos persistentes.</p>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-widest">3. Propiedad de Datos</h3>
                      <p>Los reportes generados se asocian criptográficamente a su cuenta. Usted tiene el derecho de acceder, exportar o solicitar la eliminación completa de sus datos en cualquier momento.</p>
                    </section>
                  </>
                )}
              </div>
              <div className="p-6 bg-[#050505] border-t border-neutral-900 flex justify-end">
                <button
                  onClick={() => setShowLegalModal(null)}
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-medium text-sm rounded-md transition-colors"
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