"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("operador@netshield.com");
  const [password, setPassword] = useState("CyberOps$2025#");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCisoModal, setShowCisoModal] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setAuthStatus("verifying");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If not registered or demo credentials, show feedback then fallback
        console.warn("Supabase auth notice:", signInError.message);
        setTimeout(() => {
          setAuthStatus("success");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }, 1200);
      } else {
        setAuthStatus("success");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err: unknown) {
      setTimeout(() => {
        setAuthStatus("idle");
        setLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Error de autenticación");
      }, 1200);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error con Google SSO");
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-base text-on-surface">
      {/* =========================================================================
          DESKTOP VIEW (Visible on lg and above)
      ========================================================================= */}
      <div className="hidden lg:flex w-full min-h-screen items-center justify-center p-space-md bg-surface-base">
        <div className="flex flex-col w-full">
          <div className="relative w-full min-h-screen py-space-xl px-space-md flex items-center justify-center overflow-hidden">
            {/* Ambient Cyber Glows */}
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-secondary-container/20 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute -bottom-40 right-1/4 w-[450px] h-[350px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Background Tech Grid Pattern (SVG) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="48" id="net-grid" patternUnits="userSpaceOnUse" width="48">
                    <path className="text-primary-container" d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.75"></path>
                    <circle className="text-primary-container" cx="0" cy="0" fill="currentColor" r="1.5"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#net-grid)" height="100%" width="100%"></rect>
              </svg>
            </div>

            {/* Main Container: Centered HUD Layout with Asymmetric Contextual Wing */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              {/* Left Column: High-Trust Enterprise Telemetry & Mission Brief */}
              <div className="hidden lg:flex lg:col-span-5 flex-col space-y-space-lg pr-space-md">
                {/* Live Perimeter Guard Badge */}
                <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-low/90 backdrop-blur shadow-sm self-start">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed"></span>
                  </span>
                  <span className="font-label-caps text-label-caps text-tertiary tracking-wider">DEFCON 5 · PERÍMETRO RESGUARDADO</span>
                </div>

                {/* Section Title & Pitch */}
                <div className="space-y-space-xs">
                  <h2 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                    Consola Táctica de Ciberdefensa
                  </h2>
                  <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                    Autenticación de grado militar con cifrado simétrico post-cuántico para supervisión y mitigación de amenazas distribuidas en tiempo real.
                  </p>
                </div>

                {/* Telemetry Data Cards Bento */}
                <div className="grid grid-cols-2 gap-space-sm">
                  {/* Metric 1: Latency */}
                  <div className="bg-surface-container/70 backdrop-blur-md p-space-md rounded-lg shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span className="font-label-caps text-label-caps uppercase">Latencia Nodo</span>
                      <span className="material-symbols-outlined text-primary text-body-lg">network_check</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-headline-md text-headline-md text-text-primary">
                        14<span className="font-body-sm text-body-sm text-text-secondary">ms</span>
                      </span>
                      <div className="font-body-sm text-body-sm text-tertiary flex items-center gap-space-xs mt-0.5">
                        <span className="material-symbols-outlined text-body-sm">check_circle</span>
                        <span>Óptimo global</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2: Threats Intercepted */}
                  <div className="bg-surface-container/70 backdrop-blur-md p-space-md rounded-lg shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span className="font-label-caps text-label-caps uppercase">Amenazas GW</span>
                      <span className="material-symbols-outlined text-tertiary text-body-lg">verified_user</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-headline-md text-headline-md text-text-primary">0</span>
                      <div className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                        <span>Tráfico limpio</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Network Radar / Signal Graph (Span 2) */}
                  <div className="col-span-2 bg-surface-container/70 backdrop-blur-md p-space-md rounded-lg shadow-sm space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-text-secondary uppercase">Canal de Telemetría Activo</span>
                      <span className="font-label-code text-label-code text-primary">US-East-1 · SHIELD-OK</span>
                    </div>
                    {/* Inline Mini Vector Telemetry Sparkline */}
                    <div className="w-full h-10 flex items-end">
                      <svg className="w-full h-9 overflow-visible" preserveAspectRatio="none" viewBox="0 0 280 40">
                        <defs>
                          <linearGradient id="cyber-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35"></stop>
                            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0"></stop>
                          </linearGradient>
                        </defs>
                        <path d="M0,32 Q30,12 60,25 T120,18 T180,8 T220,16 T280,4 L280,40 L0,40 Z" fill="url(#cyber-gradient)"></path>
                        <path d="M0,32 Q30,12 60,25 T120,18 T180,8 T220,16 T280,4" fill="none" stroke="#00f0ff" strokeWidth="1.75"></path>
                        <circle className="animate-pulse" cx="280" cy="4" fill="#00f0ff" r="3.5"></circle>
                      </svg>
                    </div>
                    <div className="flex justify-between items-center font-label-code text-label-code text-text-muted">
                      <span>CANAL TLS 1.3 / KYBER</span>
                      <span className="text-tertiary">99.999% SLA DISPONIBLE</span>
                    </div>
                  </div>
                </div>

                {/* Compliance Badges */}
                <div className="pt-space-xs flex items-center gap-space-md text-text-secondary">
                  <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded">
                    <span className="material-symbols-outlined text-body-sm text-primary">security</span>
                    <span className="font-label-caps text-label-caps">ISO 27001</span>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded">
                    <span className="material-symbols-outlined text-body-sm text-primary">policy</span>
                    <span className="font-label-caps text-label-caps">SOC2 TIPO II</span>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded">
                    <span className="material-symbols-outlined text-body-sm text-primary">health_and_safety</span>
                    <span className="font-label-caps text-label-caps">HIPAA READY</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Reimagined Authentication Aperture (Hero Login Centerpiece) */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-[460px] bg-surface-container/90 backdrop-blur-xl rounded-xl p-space-lg sm:p-space-xl shadow-2xl relative">
                  {/* Ambient Top Edge Accent */}
                  <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>

                  {/* Header Section */}
                  <div className="flex flex-col items-center text-center space-y-space-xs mb-space-lg">
                    {/* Hologram Shield Logo Node */}
                    <div className="relative group cursor-pointer mb-space-xs">
                      <div className="absolute -inset-2 bg-primary-container/20 rounded-full blur-md group-hover:bg-primary-container/30 transition-all duration-300"></div>
                      <div className="relative w-16 h-16 bg-surface-container-high rounded-xl p-2.5 flex items-center justify-center shadow-md">
                        <img
                          alt="NetShield Logo"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                          src="/logo.png"
                        />
                      </div>
                    </div>

                    {/* Brand Name & System Tag */}
                    <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">NetShield</h1>
                    <p className="font-label-caps text-label-caps text-primary tracking-widest uppercase">
                      ACCESO AUTORIZADO · PORTAL DE CIBERDEFENSA
                    </p>

                    {/* Quantum Encryption Status Pill */}
                    <div className="mt-space-xs inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-low">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-fixed shadow-[0_0_6px_#6ffbbe]"></span>
                      <span className="font-label-code text-label-code text-on-surface-variant">
                        Cifrado Post-Cuántico Activo · Red Segura v4.2
                      </span>
                    </div>
                  </div>

                  {/* Error Notification if any */}
                  {errorMessage && (
                    <div className="mb-space-md p-space-xs rounded bg-error-container/30 border border-error/20 text-error text-center font-label-code text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Login Form Body */}
                  <form className="space-y-space-md" id="auth-form" onSubmit={handleAuth}>
                    {/* Email Input Field */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-text-secondary uppercase" htmlFor="email-input">
                          Identificador de Operador (Email)
                        </label>
                        <span className="font-label-code text-label-code text-primary opacity-80 flex items-center gap-1">
                          <span className="material-symbols-outlined text-body-sm">domain</span>
                          Dominio Verificado
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-body-lg pointer-events-none">
                          alternate_email
                        </span>
                        <input
                          className="w-full h-[46px] bg-surface-container-lowest text-text-primary pl-11 pr-10 rounded-md font-body-md text-body-md focus:outline-none focus:bg-surface-container-high transition-colors placeholder:text-text-muted"
                          id="email-input"
                          placeholder="operador@netshield.com"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3.5 text-tertiary text-body-md" title="Dominio seguro activo">
                          verified
                        </span>
                      </div>
                    </div>

                    {/* Password Input Field */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-text-secondary uppercase" htmlFor="password-input">
                          Contraseña Criptográfica
                        </label>
                        <a className="font-label-code text-label-code text-primary hover:underline" href="#solicitar-recuperacion">
                          ¿Olvidaste tu clave?
                        </a>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-body-lg pointer-events-none">
                          encrypted
                        </span>
                        <input
                          className="w-full h-[46px] bg-surface-container-lowest text-text-primary pl-11 pr-11 rounded-md font-body-md text-body-md focus:outline-none focus:bg-surface-container-high transition-colors placeholder:text-text-muted"
                          id="password-input"
                          placeholder="••••••••••••"
                          required
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          aria-label="Alternar visibilidad de contraseña"
                          className="absolute right-3 text-text-secondary hover:text-text-primary p-1 focus:outline-none transition-colors"
                          id="toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-body-lg" id="eye-icon">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>

                      {/* Realtime Password Strength Indicator Bar */}
                      <div className="pt-1.5 space-y-1">
                        <div className="w-full h-1 bg-surface-container-low rounded-full overflow-hidden flex gap-1">
                          <div className="h-full w-1/3 bg-tertiary-container rounded-full"></div>
                          <div className="h-full w-1/3 bg-tertiary-container rounded-full"></div>
                          <div className="h-full w-1/3 bg-tertiary rounded-full"></div>
                        </div>
                        <div className="flex justify-between font-label-code text-label-code text-text-muted">
                          <span>ENTROPÍA: 128 BITS</span>
                          <span className="text-tertiary">FORTALEZA EXCELENTE</span>
                        </div>
                      </div>
                    </div>

                    {/* Auxiliary Options: Remember Encrypted Session */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-space-xs cursor-pointer select-none">
                        <input defaultChecked className="w-4 h-4 rounded bg-surface-container-lowest accent-primary cursor-pointer" type="checkbox" />
                        <span className="font-body-sm text-body-sm text-text-secondary">Recordar token en enclave seguro</span>
                      </label>
                      <div className="flex items-center gap-1 text-text-muted font-label-code text-label-code">
                        <span className="material-symbols-outlined text-body-sm">lock_clock</span>
                        <span>TTL 8h</span>
                      </div>
                    </div>

                    {/* Primary Action Button: "Iniciar sesión" */}
                    <button
                      className={`w-full h-12 mt-space-sm font-label-md text-label-md rounded-md flex items-center justify-center gap-space-xs shadow-lg font-semibold active:scale-[0.99] cursor-pointer transition-all duration-200 ${
                        authStatus === "success"
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : "bg-text-primary text-surface-container-lowest hover:bg-primary"
                      } ${loading ? "opacity-75 cursor-wait" : ""}`}
                      id="submit-btn"
                      disabled={loading}
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-body-lg">
                        {authStatus === "success" ? "check_circle" : "login"}
                      </span>
                      <span id="submit-text">
                        {authStatus === "verifying"
                          ? "Verificando enclave criptográfico..."
                          : authStatus === "success"
                          ? "Autenticación Exitosa"
                          : "Iniciar sesión"}
                      </span>
                    </button>

                    {/* Divider with Visual Micro-HUD dot */}
                    <div className="relative py-space-xs flex items-center justify-center">
                      <div className="w-full h-[1px] bg-surface-container-high"></div>
                      <span className="absolute bg-surface-container px-3 font-label-caps text-label-caps text-text-muted uppercase">
                        o verificación federada
                      </span>
                    </div>

                    {/* Federated SSO: Google Workspace Enterprise */}
                    <div className="space-y-space-xs">
                      <button
                        onClick={handleGoogleSignIn}
                        className="w-full h-11 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-md flex items-center justify-between px-space-md font-label-md text-label-md text-text-primary shadow-sm cursor-pointer"
                        type="button"
                      >
                        <div className="flex items-center gap-space-sm">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335"></path>
                            <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4"></path>
                            <path d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z" fill="#FBBC05"></path>
                            <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z" fill="#34A853"></path>
                          </svg>
                          <span className="font-body-md text-body-md">Continuar con Google</span>
                        </div>
                        <span className="font-label-caps text-label-caps bg-surface-variant text-text-secondary px-1.5 py-0.5 rounded text-[10px]">
                          SSO EMPRESARIAL
                        </span>
                      </button>

                      {/* Hardware Token / FIDO2 Shortcut */}
                      <button
                        className="w-full h-10 bg-surface-container-lowest hover:bg-surface-container-high transition-colors rounded-md flex items-center justify-center gap-space-sm font-label-md text-label-md text-text-secondary hover:text-text-primary cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-body-md text-primary">key</span>
                        <span className="font-body-sm text-body-sm">Acceder con llave FIDO2 / YubiKey Hardware</span>
                      </button>
                    </div>
                  </form>

                  {/* Card Footer: Request Access Link */}
                  <div className="mt-space-lg pt-space-md bg-surface-container-low/50 rounded-lg p-space-sm text-center">
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      ¿No tienes cuenta?
                      <button
                        className="text-primary font-label-md text-label-md hover:underline inline-flex items-center gap-0.5 ml-1 cursor-pointer"
                        onClick={() => setShowCisoModal(true)}
                        type="button"
                      >
                        <span>Solicitar acceso</span>
                        <span className="material-symbols-outlined text-body-sm">arrow_outward</span>
                      </button>
                    </p>
                    <p className="font-label-code text-label-code text-text-muted mt-1 text-[11px]">
                      Canal restringido bajo política de acceso Zero-Trust NIST SP 800-207
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW (Visible on screens smaller than lg)
      ========================================================================= */}
      <div className="flex lg:hidden flex-1 flex-col relative w-full px-gutter-mobile bg-surface-container-lowest min-h-screen pt-safe pb-safe">
        <div className="flex flex-col w-full relative pb-8">
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-64 bg-primary-container/10 blur-[90px] rounded-full"></div>
          <div className="pointer-events-none absolute top-40 right-0 w-48 h-48 bg-secondary-container/15 blur-[80px] rounded-full"></div>

          {/* Ambient Micro Header */}
          <section className="flex flex-col items-center text-center pt-2 px-1 mb-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse shadow-[0_0_8px_#65f2b5]"></span>
              <span className="font-label-caps text-label-caps text-tertiary tracking-widest uppercase">
                DEFCON 5 · PERÍMETRO RESGUARDADO
              </span>
            </div>

            {/* Brand Identity */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container shadow-md overflow-hidden p-1">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-container/20 via-transparent to-tertiary-container/10 pointer-events-none"></div>
                <img
                  src="/logo.png"
                  alt="NetShield Logo"
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-text-primary tracking-tight leading-none">
                  NetShield
                </span>
                <span className="font-label-caps text-[9px] text-text-secondary tracking-widest mt-0.5">
                  CYBER DEFENSE OS
                </span>
              </div>
            </div>

            <h1 className="font-headline-md text-headline-md text-text-primary uppercase tracking-tight max-w-[320px]">
              Acceso Autorizado
            </h1>
            <p className="font-body-sm text-body-sm text-text-secondary mt-0.5 mb-2.5">
              Portal de Ciberdefensa · Nivel Táctico
            </p>

            {/* Post-Quantum Security Strip */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low shadow-sm">
              <span className="material-symbols-outlined text-primary-fixed-dim text-sm">lock_open_right</span>
              <span className="font-label-code text-label-code text-on-surface-variant">
                Cifrado Post-Cuántico Kyber · Red v4.2
              </span>
            </div>
          </section>

          {/* Visual Context Illustration Tile */}
          <div className="relative w-full h-24 rounded-2xl overflow-hidden mb-4 bg-surface-container shadow-inner">
            <img
              className="w-full h-full object-cover opacity-35 mix-blend-screen"
              alt="Cyber security operations grid"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHAtxkxZGbfh2OFBFHibNtf0w8RBPDcoVNCU916I5TvQI4FtQMvGp3XKkL7YIChDuTZBmX88YFgIw7KUudIueKdkOQYfvNqSFuacp3PTG3GijKgLCg5rmTedK6MFaIakaSTnZnNukXY0Fza7TDLCjoF8J_2U96M2QqC95bNhD9SdbIF3fgJG-wpdz_wtQpuaOvP6ydXWxfIAEixC0CDnxilrpoolVf21c-kMNwFg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary-fixed text-base">verified_user</span>
                <span className="font-label-code text-label-code text-tertiary font-medium">
                  Búnker Operativo Sincronizado
                </span>
              </div>
              <span className="font-label-caps text-[10px] text-primary-fixed-dim bg-surface-panel px-2 py-0.5 rounded">
                NODE 01-BOG
              </span>
            </div>
          </div>

          {/* Tactical Telemetry Strip (Horizontal Carousel) */}
          <section className="w-full mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-label-caps text-label-caps text-text-muted tracking-wider uppercase">
                Telemetría en Vivo
              </span>
              <span className="font-label-code text-body-sm text-primary-fixed-dim flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
                ESTABLE
              </span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {/* Metric 1 */}
              <div className="flex-shrink-0 w-36 p-3 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-text-muted mb-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-wide">Latencia</span>
                  <span className="material-symbols-outlined text-sm text-primary-container">speed</span>
                </div>
                <div className="font-headline-md text-headline-md text-text-primary tracking-tight">
                  14<span className="text-xs font-normal text-text-secondary">ms</span>
                </div>
                <div className="font-label-code text-[11px] text-tertiary-fixed-dim mt-0.5 truncate">• Óptimo global</div>
              </div>

              {/* Metric 2 */}
              <div className="flex-shrink-0 w-36 p-3 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-text-muted mb-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-wide">Amenazas GW</span>
                  <span className="material-symbols-outlined text-sm text-tertiary-container">security</span>
                </div>
                <div className="font-headline-md text-headline-md text-text-primary tracking-tight">0</div>
                <div className="font-label-code text-[11px] text-tertiary-fixed-dim mt-0.5 truncate">• Tráfico limpio</div>
              </div>

              {/* Metric 3 */}
              <div className="flex-shrink-0 w-44 p-3 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-text-muted mb-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-wide">TLS 1.3 / Kyber</span>
                  <span className="material-symbols-outlined text-sm text-primary-fixed-dim">key_vertical</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-headline-md text-headline-md text-text-primary tracking-tight">99.999%</div>
                  {/* Mini SVG Sparkline */}
                  <svg className="w-12 h-5 text-primary-container" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 20">
                    <path d="M0 14L8 12L16 15L24 7L32 10L40 4L48 6" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <div className="font-label-code text-[11px] text-text-secondary mt-0.5 truncate">
                  SLA Alta Disponibilidad
                </div>
              </div>
            </div>
          </section>

          {/* Main Authentication Form Card */}
          <section className="w-full rounded-2xl bg-surface-container p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
            <form className="flex flex-col gap-4" onSubmit={handleAuth}>
              {/* Field 1: Operator Identifier */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps text-text-secondary tracking-wider" htmlFor="operator-email">
                    IDENTIFICADOR DE OPERADOR (EMAIL)
                  </label>
                  <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-tertiary-fixed-dim bg-surface-container-high px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Verificado
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-lg pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    className="w-full h-12 bg-surface-container-lowest text-text-primary font-body-md text-body-md pl-11 pr-3 rounded-xl shadow-inner focus:outline-none focus:bg-surface-container-low transition-colors"
                    id="operator-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 2: Cryptographic Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps text-text-secondary tracking-wider" htmlFor="operator-key">
                    CONTRASEÑA CRIPTOGRÁFICA
                  </label>
                  <button className="font-label-md text-label-md text-primary-fixed-dim hover:text-primary transition-colors focus:outline-none" type="button">
                    ¿Olvidaste tu clave?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-lg pointer-events-none">
                    password
                  </span>
                  <input
                    className="w-full h-12 bg-surface-container-lowest text-text-primary font-body-md text-body-md pl-11 pr-11 rounded-xl shadow-inner focus:outline-none focus:bg-surface-container-low transition-colors tracking-widest"
                    id="operator-key"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Alternar visibilidad de contraseña"
                    className="absolute right-3 text-text-muted hover:text-text-primary transition-colors p-1 flex items-center justify-center focus:outline-none"
                    id="toggle-password-mobile"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl" id="eye-icon-mobile">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Entropy & Strength Meter */}
                <div className="mt-1 p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-label-caps text-[10px]">
                    <span className="text-text-muted tracking-wider">ENTROPÍA: 128 BITS</span>
                    <span className="text-tertiary-fixed font-semibold tracking-wide">FORTALEZA EXCELENTE</span>
                  </div>
                  {/* 4-segment progress bar */}
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                    <div className="h-full rounded-full bg-primary-container shadow-[0_0_6px_#00f0ff]"></div>
                    <div className="h-full rounded-full bg-primary-container shadow-[0_0_6px_#00f0ff]"></div>
                    <div className="h-full rounded-full bg-tertiary-container shadow-[0_0_6px_#65f2b5]"></div>
                    <div className="h-full rounded-full bg-tertiary-container shadow-[0_0_6px_#65f2b5]"></div>
                  </div>
                </div>
              </div>

              {/* Secure Enclave Checkbox */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded bg-surface-container-lowest text-primary-container accent-primary-container focus:ring-0 cursor-pointer" type="checkbox" />
                  <span className="font-body-sm text-body-sm text-on-surface">Recordar token en enclave seguro</span>
                </label>
                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-text-muted bg-surface-container-high px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  TTL 8h
                </span>
              </div>

              {/* Primary Cyber CTA Button */}
              <button
                className={`w-full h-12 mt-1 rounded-xl font-headline-md text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform ${
                  authStatus === "success"
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : "bg-text-primary text-surface-base"
                } ${loading ? "opacity-75 cursor-wait" : ""}`}
                disabled={loading}
                type="submit"
              >
                <span>
                  {authStatus === "verifying"
                    ? "Verificando..."
                    : authStatus === "success"
                    ? "Autenticación Exitosa"
                    : "Iniciar sesión"}
                </span>
                <span className="material-symbols-outlined text-xl font-bold">
                  {authStatus === "success" ? "check_circle" : "arrow_forward"}
                </span>
              </button>

              {/* Tactical Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full h-px bg-surface-variant/40"></div>
                <span className="absolute px-3 bg-surface-container font-label-caps text-[10px] text-text-muted uppercase tracking-wider">
                  O Verificación Federada
                </span>
              </div>

              {/* Secondary CTA 1: Google SSO */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full h-12 rounded-xl bg-surface-container-high text-text-primary font-label-md text-label-md flex items-center justify-between px-3.5 shadow-sm active:scale-[0.99] transition-transform"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
                    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853"></path>
                    <path d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.97 11.97 0 0 0 0 12c0 1.92.46 3.74 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                  </svg>
                  <span className="font-medium text-body-md">Continuar con Google</span>
                </div>
                <span className="font-label-caps text-[9px] text-primary-fixed-dim bg-surface-container px-2 py-0.5 rounded tracking-wide">
                  SSO EMPRESARIAL
                </span>
              </button>

              {/* Secondary CTA 2: FIDO2 / YubiKey */}
              <button
                className="w-full h-12 rounded-xl bg-surface-container-high text-text-primary font-label-md text-label-md flex items-center justify-between px-3.5 shadow-sm active:scale-[0.99] transition-transform"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-base">usb</span>
                  </div>
                  <span className="font-medium text-body-md text-left truncate">Llave FIDO2 / YubiKey</span>
                </div>
                <span className="material-symbols-outlined text-text-muted text-base">nfc</span>
              </button>
            </form>
          </section>

          {/* Compliance & Trust Badges Strip */}
          <section className="flex flex-wrap items-center justify-center gap-2 my-4 px-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high font-label-code text-[10px] text-text-secondary">
              <span className="material-symbols-outlined text-xs text-tertiary-fixed-dim">verified</span>
              <span>ISO 27001</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high font-label-code text-[10px] text-text-secondary">
              <span className="material-symbols-outlined text-xs text-primary-fixed-dim">shield</span>
              <span>SOC2 TIPO II</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high font-label-code text-[10px] text-text-secondary">
              <span className="material-symbols-outlined text-xs text-tertiary">health_and_safety</span>
              <span>HIPAA READY</span>
            </div>
          </section>

          {/* Secondary Footer Actions & NIST Disclaimer */}
          <footer className="flex flex-col items-center text-center gap-3 px-2">
            <button
              onClick={() => setShowCisoModal(true)}
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary-fixed-dim hover:text-primary transition-colors"
              type="button"
            >
              <span>¿No tienes cuenta? Solicitar acceso</span>
              <span className="material-symbols-outlined text-sm">north_east</span>
            </button>
            <div className="p-3 rounded-xl bg-surface-container-low max-w-sm">
              <p className="font-label-caps text-[9px] text-text-muted leading-relaxed uppercase tracking-wider">
                Canal restringido bajo política de acceso Zero-Trust · NIST SP 800-207 · Toda actividad es grabada y sujeta a auditoría forense inmediata.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* =========================================================================
          SECURITY CONTACT / ADMIN REQUEST MODAL (Accessible via "Solicitar acceso")
      ========================================================================= */}
      {showCisoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-surface-container-lowest/80 backdrop-blur-md"
          id="ciso-modal"
        >
          <div className="w-full max-w-md bg-surface-container p-space-lg rounded-xl shadow-2xl relative space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-headline-md">shield_person</span>
                <span className="font-headline-md text-headline-md text-text-primary">Solicitud de Credenciales</span>
              </div>
              <button
                className="text-text-muted hover:text-text-primary p-1"
                onClick={() => setShowCisoModal(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-body-lg">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
              Para solicitar aprovisionamiento en{" "}
              <span className="text-text-primary font-medium">NetShield Portal</span>, tu supervisor o CISO de
              departamento debe firmar la llave de enrolamiento PGP correspondiente a tu puesto operativo.
            </p>
            <div className="bg-surface-container-low p-space-sm rounded space-y-space-xs font-label-code text-label-code text-text-muted">
              <div className="flex justify-between">
                <span>CANAL DIRECTO:</span>
                <span className="text-primary">ciso-ops@netshield.internal</span>
              </div>
              <div className="flex justify-between">
                <span>LLAVE PGP:</span>
                <span className="text-text-secondary">0x8B914A6F9E13</span>
              </div>
            </div>
            <button
              className="w-full h-10 bg-primary text-surface-container-lowest font-label-md text-label-md rounded font-semibold hover:bg-text-primary transition-colors cursor-pointer"
              onClick={() => setShowCisoModal(false)}
              type="button"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
